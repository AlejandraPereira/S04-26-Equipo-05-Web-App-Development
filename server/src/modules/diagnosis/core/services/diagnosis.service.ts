import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { DiagnosisResultOrmEntity } from '../../persistence/postgres/entities/diagnosis-result.orm.entity';
import { SubmitDiagnosisDto } from '../dtos/submit-diagnosis.dto';

@Injectable()
export class DiagnosisService {
  constructor(
    @InjectRepository(DiagnosisResultOrmEntity)
    private readonly repo: Repository<DiagnosisResultOrmEntity>,
  ) {}

  async submit(userId: string, dto: SubmitDiagnosisDto) {
    const averageScore =
      dto.skills.length > 0
        ? Math.round(dto.skills.reduce((acc, s) => acc + s.score, 0) / dto.skills.length)
        : 0;

    const result = this.repo.create({
      id: uuidv4(),
      userId,
      skills: dto.skills,
      answers: dto.answers,
      averageScore,
    });
    return this.repo.save(result);
  }

  async getLatestResult(userId: string) {
    return this.repo.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
