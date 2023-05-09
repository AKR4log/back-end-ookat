import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from 'src/auth/jwt.strategy'
import { getJwtConfig } from 'src/config/jwt.config'
import { PrismaService } from 'src/prisma.service'
import { SellerController } from './seller.controller'
import { SellerService } from './seller.service'

@Module({
	controllers: [SellerController],
	providers: [SellerService, JwtStrategy, PrismaService],
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig
		})
	]
})
export class SellerModule {}