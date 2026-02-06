import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Request, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DonorsService } from './donors.service';
import { CreateGuestDonorDto } from './dto/create-guest-donor.dto';
import { ProcessDonationDto } from './dto/process-donation.dto';
import { QueryDonationsDto } from './dto/query-donations.dto';
import { QueryDonorsListDto } from './dto/query-donors-list.dto';

@ApiTags('donors')
@Controller('donors')
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) { }

  @Get()
  findAll(@Query() query: QueryDonorsListDto) {
    return this.donorsService.findAll(query);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMyProfile(@Request() req: any) {
    const donor = await this.donorsService.findByEmail(req.user?.email ?? '');
    return donor ?? null;
  }

  @Get('me/donations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMyDonations(@Request() req: any, @Query() query: QueryDonationsDto) {
    return this.donorsService.findDonationsByUserId(req.user.userId, query);
  }

  @Get('me/tax-summaries')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getTaxSummaries(@Request() req: any, @Query() query: QueryDonationsDto) {
    return this.donorsService.getDonationSummaries(req.user.userId, query);
  }

  @Get('me/full-history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getFullHistory(@Request() req: any) {
    return this.donorsService.getFullHistory(req.user.userId);
  }

  @Post('process-donation')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async processDonation(@Request() req: any, @Body() dto: ProcessDonationDto) {
    return this.donorsService.processDonation(req.user.userId, dto);
  }

  /**
   * First-time "Donate without Signup": create guest donor.
   * If PAN already exists, returns 409 – user must use Login to Donate.
   */
  @Post('guest-donate')
  async guestDonate(@Body() dto: CreateGuestDonorDto) {
    return this.donorsService.createGuestOrReject(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.donorsService.findById(id);
  }

  @Get(':id/donations')
  async getUserDonations(@Param('id', ParseIntPipe) id: number, @Query() query: QueryDonationsDto) {
    return this.donorsService.findDonationsByUserId(id, query);
  }

  @Post(':id/send-report')
  @UseInterceptors(FileInterceptor('file'))
  async sendReport(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: any) {
    return this.donorsService.sendHistoryReport(id, file);
  }
}
