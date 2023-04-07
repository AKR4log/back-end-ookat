import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module'
import { GatewayModule } from './gateway/gateway.module'
import { MediaModule } from './media/media.module'
import { OrderModule } from './order/order.module'
import { PrismaService } from './prisma.service'
import { ProductModule } from './product/product.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		GatewayModule,
		AuthModule,
		UserModule,
		ProductModule,
		// ReviewModule,
		CategoryModule,
		OrderModule,
		MediaModule
	],
	controllers: [AppController],
	providers: [AppService, PrismaService]
})
export class AppModule {}
