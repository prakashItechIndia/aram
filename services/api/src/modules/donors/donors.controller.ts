import { Body, Controller, Get, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DonorsService } from './donors.service';
import { CreateGuestDonorDto } from './dto/create-guest-donor.dto';
import { ProcessDonationDto } from './dto/process-donation.dto';

@ApiTags('donors')
@Controller('donors')
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) {}

  @Get()
  findAll() {
    return this.donorsService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMyProfile(@Request() req: any) {
    const donor = await this.donorsService.findByEmail(req.user?.email ?? '');
    return donor ?? null;
  }

  @Post('process-donation')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async processDonation(@Request() req: any, @Body() dto: ProcessDonationDto) {
    return this.donorsService.processDonation(req.user.sub, dto);
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
}
