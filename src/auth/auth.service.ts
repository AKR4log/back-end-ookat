import { Injectable } from '@nestjs/common'
import {
	BadRequestException,
	UnauthorizedException
} from '@nestjs/common/exceptions'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import axios from 'axios'
import { PrismaService } from 'src/prisma.service'
import { ConfirmSmsDto } from './dto/confrim-sms.dto'
import { PushSmsDto } from './dto/push-sms-dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
		private config: ConfigService
	) {}

	// async login(dto: AuthDto) {
	// 	const user = await this.validateUser(dto)
	// 	const tokens = await this.issueTokens(user.id.toString())

	// 	return {
	// 		user: this.returnFields(user),
	// 		...tokens
	// 	}
	// }

	async getNewTokens(dto: RefreshTokenDto) {
		const result = await this.jwtService.verifyAsync(dto.refreshToken)
		if (!result) throw new UnauthorizedException('Invalid refresh token')

		const user = await this.prisma.user.findUnique({ where: { id: result.id } })
		const tokens = await this.issueTokens(user.id.toString())

		return {
			user: this.returnFields(user),
			...tokens
		}
	}

	async register(phone: string) {
		const oldUser = await this.prisma.user.findUnique({
			where: {
				phone: phone
			}
		})

		if (oldUser) throw new BadRequestException('User already exists')

		const user = await this.prisma.user.create({
			data: {
				phone: phone,
				name: ''
			}
		})

		const tokens = await this.issueTokens(user.id.toString())

		return {
			user: this.returnFields(user),
			...tokens
		}
	}

	async sendCode(dto: PushSmsDto) {
		try {
			const token = this.config.get('PUSHSMS_TOKEN')
			const sender = this.config.get('PUSHSMS_SENDER')
			const code = this.generateCode()
			await axios.post(
				'https://api.pushsms.ru/api/v1/delivery',
				{
					text: code,
					phone: dto.phone,
					sender_name: sender
				},
				{
					headers: {
						Authorization: 'Bearer ' + token
					}
				}
			)
			return {
				token: this.jwtService.sign(
					{ code: code, phone: dto.phone },
					{
						expiresIn: '1h'
					}
				)
			}
		} catch (e) {
			return { error: e }
		}
	}

	async confirmCode(dto: ConfirmSmsDto) {
		try {
			const tokenVerify = this.jwtService.verify(dto.token)

			if (tokenVerify.code === dto.code) {
				const oldUser = await this.prisma.user.findUnique({
					where: {
						phone: tokenVerify.phone
					}
				})

				if (oldUser) {
					const tokens = await this.issueTokens(oldUser.id.toString())

					return {
						user: this.returnFields(oldUser),
						...tokens
					}
				}

				const user = await this.prisma.user.create({
					data: {
						phone: tokenVerify.phone,
						name: ''
					}
				})

				const tokens = await this.issueTokens(user.id.toString())

				return {
					stutus: 'Created successfully',
					user: this.returnFields(user),
					...tokens
				}
			}
			return { error: 'Invalid code' }
		} catch (e) {
			return { error: e }
		}
	}

	private async issueTokens(userId: string) {
		const data = { id: userId }

		const accessToken = this.jwtService.sign(data, {
			expiresIn: '1h'
		})

		const refreshToken = this.jwtService.sign(data, {
			expiresIn: '7d'
		})

		return { accessToken, refreshToken }
	}

	private returnFields(user: User) {
		return {
			id: user.id
		}
	}

	private generateCode(): string {
		const digits = '0123456789'
		let code = ''
		for (let i = 0; i < 5; i++) {
			const index = Math.floor(Math.random() * digits.length)
			code += digits.charAt(index)
		}
		return code
	}
}
