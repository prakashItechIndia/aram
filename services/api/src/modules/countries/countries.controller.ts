import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CountriesService } from './countries.service';

@ApiTags('countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get available countries based on donation form settings',
    description:
      'Returns all countries if multiCountry is enabled, otherwise returns only India',
  })
  getCountries() {
    return this.countriesService.getCountries();
  }
}
