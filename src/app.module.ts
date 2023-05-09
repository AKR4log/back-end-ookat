import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { BrandModule } from './brand/brand.module'
import { CategoryModule } from './category/category.module'
import { MediaModule } from './media/media.module'
import { OrderModule } from './order/order.module'
import { ProductModule } from './product/product.module'
import { SellerModule } from './seller/seller.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		UserModule,
		ProductModule,
		BrandModule,
		SellerModule,
		CategoryModule,
		OrderModule,
		MediaModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
