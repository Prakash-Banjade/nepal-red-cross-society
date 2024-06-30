import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { BloodInventoryStatus } from 'src/core/types/fieldsEnum.types';
import { Donor } from 'src/donors/entities/donor.entity';
import { BloodInventory } from 'src/inventory/entities/blood_inventory.entity';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(BloodInventory) private readonly bloodInventoryRepo: Repository<BloodInventory>,
    @InjectRepository(Donor) private readonly donorRepo: Repository<Donor>,
    private readonly mailService: MailService,
  ) { }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateExpired() {
    console.log('Running daily task to update expired blood inventories');
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0)).toISOString();
    const todayEnd = new Date(now.setHours(23, 59, 59, 999)).toISOString();

    await this.bloodInventoryRepo
      .createQueryBuilder()
      .update(BloodInventory)
      .set({ status: BloodInventoryStatus.EXPIRED })
      .where('expiry BETWEEN :todayStart AND :todayEnd', { todayStart, todayEnd })
      .where('status = :status', { status: BloodInventoryStatus.USABLE })
      .execute();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async wishHappyBirthday() {
    console.log('Checking for birthdays');
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const donors = await this.donorRepo
      .createQueryBuilder('donor')
      .where('MONTH(donor.dob) = :month AND DAY(donor.dob) = :day', { month, day })
      .getMany();

    for (const donor of donors) {
      await this.mailService.wishBirthday(donor);
    }
  }
}