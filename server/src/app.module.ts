import { Module } from '@nestjs/common';
import { CompanyMarketplaceModule } from './modules/company-marketplace/company-marketplace.module';
import { ConfigModule } from '@nestjs/config';
import { ProfessionalProfileModule } from './modules/professional-profile/professional-profile.module';

@Module({
  imports: [
    CompanyMarketplaceModule,
    ProfessionalProfileModule,
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
