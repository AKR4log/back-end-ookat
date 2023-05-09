import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { BrandController } from './brand.controller'
import { BrandService } from './brand.service'

@Module({
	controllers: [BrandController],
	providers: [BrandService, PrismaService]
})
export class BrandModule {}