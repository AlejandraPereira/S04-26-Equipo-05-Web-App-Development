import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { JobApplicationOrmEntity, ApplicationStatus } from '../../persistence/postgres/entities/job-application.orm.entity';
import { JobOpportunityOrmEntity } from '../../persistence/postgres/entities/job-opportunity.orm.entity';
import { CompanyOrmEntity } from '../../persistence/postgres/entities/company.orm.entity';
import { UserOrmEntity } from '../../../auth/persistence/postgres/entities/user.orm.entity';
import { NotificationsService } from '../../../notifications/notifications.service';

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectRepository(JobApplicationOrmEntity)
    private readonly appRepo: Repository<JobApplicationOrmEntity>,
    @InjectRepository(JobOpportunityOrmEntity)
    private readonly jobRepo: Repository<JobOpportunityOrmEntity>,
    @InjectRepository(CompanyOrmEntity)
    private readonly companyRepo: Repository<CompanyOrmEntity>,
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async apply(userId: string, jobId: string, coverLetter?: string) {
    const job = await this.jobRepo.findOneBy({ id: jobId });
    if (!job) throw new NotFoundException('Oferta no encontrada');

    const existing = await this.appRepo.findOneBy({ userId, jobId });
    if (existing) throw new ConflictException('Ya te postulaste a esta oferta');

    const app = this.appRepo.create({
      id: uuidv4(),
      jobId,
      userId,
      coverLetter: coverLetter ?? null,
      status: ApplicationStatus.PENDING,
    });
    const saved = await this.appRepo.save(app);

    // Notificar al dueño de la empresa
    try {
      const company = await this.companyRepo.findOneBy({ id: job.companyId });
      const professional = await this.userRepo.findOneBy({ id: userId });
      if (company && professional) {
        await this.notificationsService.notify(
          company.userId,
          `📩 ${professional.fullName} se postuló a tu oferta "${job.title}"`,
          'application',
        );
      }
    } catch (_) { /* non-critical */ }

    return saved;
  }

  async getMyApplications(userId: string) {
    return this.appRepo.find({
      where: { userId },
      relations: ['job'],
      order: { appliedAt: 'DESC' },
    });
  }

  async getApplicationsForJob(jobId: string) {
    return this.appRepo.find({
      where: { jobId },
      relations: ['user'],
      order: { appliedAt: 'DESC' },
    });
  }

  async updateStatus(applicationId: string, status: ApplicationStatus) {
    const app = await this.appRepo.findOneBy({ id: applicationId });
    if (!app) throw new NotFoundException('Postulación no encontrada');
    app.status = status;
    const saved = await this.appRepo.save(app);

    // Notificar al profesional del cambio de estado
    try {
      const job = await this.jobRepo.findOneBy({ id: app.jobId });
      const STATUS_MSG: Record<ApplicationStatus, string> = {
        [ApplicationStatus.PENDING]: 'pendiente',
        [ApplicationStatus.REVIEWED]: 'revisada',
        [ApplicationStatus.INTERVIEW]: '🎉 seleccionada para entrevista',
        [ApplicationStatus.ACCEPTED]: '✅ aceptada',
        [ApplicationStatus.REJECTED]: 'rechazada',
      };
      if (job) {
        await this.notificationsService.notify(
          app.userId,
          `Tu postulación a "${job.title}" fue marcada como ${STATUS_MSG[status] ?? status}`,
          'status_change',
        );
      }
    } catch (_) { /* non-critical */ }

    return saved;
  }

  async getAppliedJobIds(userId: string): Promise<string[]> {
    const apps = await this.appRepo.find({ where: { userId }, select: ['jobId'] });
    return apps.map(a => a.jobId);
  }

  async getCompanyStats(userId: string) {
    const company = await this.companyRepo.findOneBy({ userId });
    if (!company) return { activeJobs: 0, reviewed: 0, interview: 0 };

    const jobs = await this.jobRepo.findBy({ companyId: company.id });
    if (jobs.length === 0) return { activeJobs: 0, reviewed: 0, interview: 0 };

    const jobIds = jobs.map(j => j.id);
    const [reviewed, interview] = await Promise.all([
      this.appRepo.count({ where: { jobId: In(jobIds), status: ApplicationStatus.REVIEWED } }),
      this.appRepo.count({ where: { jobId: In(jobIds), status: ApplicationStatus.INTERVIEW } }),
    ]);

    return { activeJobs: jobs.length, reviewed, interview };
  }
}
