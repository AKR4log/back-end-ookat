import { Prisma } from '@prisma/client'

export const userDro: Prisma.UserSelect = {
	id: true,
	name: true,
	avatarPath: true,
	phone: true
}