import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { Gateway } from './gateway'

@Module({
	providers: [Gateway, PrismaService]
})
export class GatewayModule {}
