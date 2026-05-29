import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ProfessionalProfileOrmEntity } from '../professional-profile/persistence/postgres/entities/professional-profile.orm.entity';
import { UserOrmEntity } from '../auth/persistence/postgres/entities/user.orm.entity';
import { DiagnosisResultOrmEntity } from '../diagnosis/persistence/postgres/entities/diagnosis-result.orm.entity';
import { CandidateEvaluationOrmEntity } from './persistence/candidate-evaluation.orm.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(ProfessionalProfileOrmEntity)
    private readonly profileRepo: Repository<ProfessionalProfileOrmEntity>,
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,
    @InjectRepository(DiagnosisResultOrmEntity)
    private readonly diagnosisRepo: Repository<DiagnosisResultOrmEntity>,
    @InjectRepository(CandidateEvaluationOrmEntity)
    private readonly evalRepo: Repository<CandidateEvaluationOrmEntity>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async listCandidates() {
    const profiles = await this.profileRepo.find();
    if (profiles.length === 0) return [];

    const userIds = profiles.map(p => p.userId);

    const [users, diagnoses] = await Promise.all([
      this.userRepo.findByIds(userIds),
      this.diagnosisRepo
        .createQueryBuilder('d')
        .where('d.userId IN (:...ids)', { ids: userIds })
        .orderBy('d.createdAt', 'DESC')
        .getMany(),
    ]);

    const userMap = new Map(users.map(u => [u.id, u]));
    const diagnosisMap = new Map<string, { name: string; score: number }[]>();
    for (const d of diagnoses) {
      if (!diagnosisMap.has(d.userId)) diagnosisMap.set(d.userId, d.skills);
    }

    return profiles.map(p => ({
      id: p.id,
      userId: p.userId,
      fullName: userMap.get(p.userId)?.fullName ?? 'Profesional',
      headline: p.headline ?? null,
      location: p.location ?? null,
      summary: p.summary ?? null,
      yearsExperience: p.yearsExperience ?? null,
      linkedinUrl: p.linkedinUrl ?? null,
      completionScore: p.completionScore,
      skills: diagnosisMap.get(p.userId) ?? [],
    }));
  }

  async createEvaluation(evaluatorUserId: string, candidateUserId: string, rating: number, feedback: string, jobId?: string) {
    const evaluation = this.evalRepo.create({
      id: uuidv4(),
      candidateUserId,
      evaluatorUserId,
      jobId: jobId ?? null,
      rating,
      feedback,
    });
    const saved = await this.evalRepo.save(evaluation);

    // Notificar al candidato
    try {
      const evaluator = await this.userRepo.findOneBy({ id: evaluatorUserId });
      const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
      await this.notificationsService.notify(
        candidateUserId,
        `📋 ${evaluator?.fullName ?? 'Una empresa'} te dejó una evaluación interna: ${stars}`,
        'evaluation',
      );
    } catch (_) { /* non-critical */ }

    return saved;
  }

  async getEvaluations(candidateUserId: string) {
    return this.evalRepo.find({
      where: { candidateUserId },
      relations: ['evaluator'],
      order: { createdAt: 'DESC' },
    });
  }

  async getMyEvaluations(userId: string) {
    const evals = await this.evalRepo.find({
      where: { candidateUserId: userId },
      relations: ['evaluator'],
      order: { createdAt: 'DESC' },
    });

    return evals.map(e => ({
      id: e.id,
      rating: e.rating,
      feedback: e.feedback,
      createdAt: e.createdAt,
      evaluatorName: e.evaluator?.fullName ?? 'Empresa',
      jobId: e.jobId ?? null,
    }));
  }
}
