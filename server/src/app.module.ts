import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { YearPlansModule } from './year-plans/year-plans.module';
import { MonthPlansModule } from './month-plans/month-plans.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    YearPlansModule,
    MonthPlansModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
