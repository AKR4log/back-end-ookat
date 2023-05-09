import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class SellerService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
		private config: ConfigService
	) {}
}
