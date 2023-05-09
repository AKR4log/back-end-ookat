import { Prisma } from '@prisma/client'

export const brandDro: Prisma.BrandSelect = {
	id: true,
	name: true,
	avatarPath: true
}