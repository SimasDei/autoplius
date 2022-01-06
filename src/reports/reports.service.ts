import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { ApproveReportDto } from './dtos/approveReport.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: string, body: ApproveReportDto) {
    console.log(
      '🚀 ~ file: reports.service.ts ~ line 20 ~ ReportsService ~ changeApproval ~ id',
      id,
    );
    const report = await this.repo.findOne(id);

    if (!report) {
      throw new NotFoundException(`Report with id ${id} not found`);
    }

    report.approved = body.approved;

    return this.repo.save(report);
  }
}
