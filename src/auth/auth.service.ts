import { Injectable } from '@nestjs/common'
import {
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common/exceptions'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { verify } from 'argon2'
import axios from 'axios'
import { PrismaService } from 'src/prisma.service'
import { AuthAdmDto } from './dto/auth-adm.dto'
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

	async getNewTokens(dto: RefreshTokenDto) {
		const result = await this.jwtService.verifyAsync(dto.refreshToken)
		if (!result) throw new UnauthorizedException('Invalid refresh token')

		const user = await this.prisma.user.findUnique({ where: { id: result.id } })
		const tokens = await this.issueTokens(user)

		return {
			user: this.returnFields(user),
			...tokens
		}
	}

	async loginAdm(dto: AuthAdmDto) {
		const user = await this.validateUser(dto)
		const tokens = await this.issueTokens(user)

		return {
			user: this.returnFields(user),
			...tokens
		}
	}

	async sendCode(dto: PushSmsDto) {
		try {
			const token = this.config.get('SMSPRO_TOKEN')
			const link = this.config.get('SMSPRO_LINK')
			const req = await axios.post(
				link,
				{
					transaction_id: Math.random().toString(16).substr(2, 8),
					phone: dto.phone
				},
				{
					headers: {
						'X-API-KEY': token
					}
				}
			)

			const data = req.data

			const reqToken = this.jwtService.sign(
				{ token: data.token, phone: dto.phone },
				{
					expiresIn: '1h'
				}
			)

			return { token: reqToken }
		} catch (e) {
			return { error: e }
		}
	}

	async confirmCode(dto: ConfirmSmsDto) {
		try {
			const tokenVerify = this.jwtService.verify(dto.token)
			const token = this.config.get('SMSPRO_TOKEN')

			const req = await axios.post(
				'https://smspro.nikita.kg/api/otp/verify',
				{
					token: tokenVerify.token,
					code: dto.code
				},
				{
					headers: {
						'X-API-KEY': token
					}
				}
			)
			const res = req.data
			if (res.status == 0) {
				const oldUser = await this.prisma.user.findUnique({
					where: {
						phone: tokenVerify.phone
					}
				})

				if (oldUser) {
					const tokens = await this.issueTokens(oldUser)

					return {
						user: this.returnFields(oldUser),
						...tokens
					}
				}

				const user = await this.prisma.user.create({
					data: {
						phone: tokenVerify.phone,
						name: null,
						password: null
					}
				})

				const tokens = await this.issueTokens(user)

				return {
					stutus: 'Created successfully',
					user: this.returnFields(user),
					...tokens
				}
			}
			return { req: req.data }
		} catch (e) {
			return { error: e }
		}
	}

	private async issueTokens(user: User) {
		const data = { ...user }

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

	private async validateUser(dto: AuthAdmDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		})
		if (!user) throw new NotFoundException('User not found')

		const isValid = await verify(user.password, dto.password)
		if (!isValid) throw new UnauthorizedException('Invalid credentials')

		return user
	}
}
