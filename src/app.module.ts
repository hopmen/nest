import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TopPageModule } from './top-page/top-page.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { RoomModule } from './room/room.module';
import { ЕшtimetableModule } from './ешtimetable/ешtimetable.module';

@Module({
  imports: [AuthModule, TopPageModule, ProductModule, ReviewModule, RoomModule, ЕшtimetableModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
