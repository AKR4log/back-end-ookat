import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { userDro } from './user.dro'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async byId(id: string, selectObj: Prisma.UserSelect = {}) {
		const user = await this.prisma.user.findUnique({
			where: { id: id },
			select: {
				...userDro,
				favorites: {
					select: {
						id: true,
						// name: true,
						// price: true,
						// images: true
					}
				},
				...selectObj
			}
		})

		if (!user) throw new NotFoundException('User not found')

		return user
	}

	// async updateProfile(id: string, dto: UserDto) {
	// 	const isSameUser = await this.prisma.user.findUnique({
	// 		where: { email: dto.email }
	// 	})
	// 	if (isSameUser && id === isSameUser.id)
	// 		throw new BadRequestException('Email already in use')

	// 	const user = await this.byId(id)

	// 	return this.prisma.user.update({
	// 		where: { id: id },
	// 		data: {
	// 			email: dto.email,
	// 			name: dto.name,
	// 			avatarPath: dto.avatarPath,
	// 			phone: dto.phone,
	// 			password: dto.password ? await hash(dto.password) : user.password
	// 		}
	// 	})
	// }

	async toggleFavorite(id: string, favoriteProductId: string) {
		const user = await this.byId(id)
		if (!user) throw new NotFoundException('User not found')

		const isExists = user.favorites.some(
			product => product.id === favoriteProductId
		)

		await this.prisma.user.update({
			where: { id: user.id },
			data: {
				favorites: {
					[isExists ? 'disconnect' : 'connect']: { id: favoriteProductId }
				}
			}
		})

		return [isExists ? 'disconnect' : 'connect']
	}
}
