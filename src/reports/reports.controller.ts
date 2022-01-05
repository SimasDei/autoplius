import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';

import { AuthGuard } from 'src/guards/auth.guard';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(AuthGuard)
  @Post()
  createReport(@Body() body: CreateReportDto) {
    console.log(
      '🚀 ~ file: reports.controller.ts ~ line 14 ~ ReportsController ~ createReport ~ body',
      body,
    );
    return 'crrateReport';
  }
}
