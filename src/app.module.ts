import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './common/db/db.module';
import { TourModule } from './modules/tour/tour.module';
import { DiscountModule } from './modules/discount/discount.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderDetailModule } from './modules/order-detail/order-detail.module';
import { CtvOrderModule } from './modules/ctv-order/ctv-order.module';
import { AdminActionModule } from './modules/admin-action/admin-action.module';
import { PaymentModule } from './modules/payment/payment.module';
import { UserModule } from './modules/user/user.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    AuthModule,
    TourModule,
    DiscountModule,
    CartModule,
    OrderDetailModule,
    CtvOrderModule,
    AdminActionModule,
    PaymentModule,
    UserModule,
    OrderModule,
  ]
})
export class AppModule {}
