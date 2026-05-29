import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { NotificationOrmEntity, NotificationType } from './persistence/notification.orm.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationOrmEntity)
    private readonly repo: Repository<NotificationOrmEntity>,
  ) {}

  async notify(userId: string, message: string, type: NotificationType = 'system') {
    const notification = this.repo.create({
      id: uuidv4(),
      userId,
      message,
      type,
      read: false,
    });
    return this.repo.save(notification);
  }

  async getMyNotifications(userId: string) {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 30,
    });
  }

  async markAllAsRead(userId: string) {
    await this.repo
      .createQueryBuilder()
      .update(NotificationOrmEntity)
      .set({ read: true })
      .where('userId = :userId AND read = false', { userId })
      .execute();
    return { success: true };
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.repo.count({ where: { userId, read: false } });
  }
}
