import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FeatureConfigService } from './feature-config.service';
import { GetFeatureConfigResponseDto } from './dto/feature-config.dto';

@ApiTags('config')
@Controller('config')
export class ConfigController {
  constructor(private readonly featureConfigService: FeatureConfigService) {}

  /**
   * Public endpoint: current feature config (donation form settings).
   * Use for: logic, inputs, UI visibility, SMS/email decisions.
   */
  @Get('donation-form')
  @ApiOkResponse({ description: 'Donation form and feature config', type: GetFeatureConfigResponseDto })
  async getDonationFormConfig() {
    const { items, donationForm } = await this.featureConfigService.getAllConfig();
    return {
      items: items.map((i) => ({ key: i.key, value: i.value, isEnabled: i.isEnabled })),
      donationForm,
    };
  }

  /**
   * Same as donation-form but returns only the parsed donationForm object (for frontend).
   */
  @Get('donation-form/flat')
  @ApiOkResponse({ description: 'Flattened donation form config' })
  async getDonationFormConfigFlat() {
    return this.featureConfigService.getDonationFormConfig();
  }
}
