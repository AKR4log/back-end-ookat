import { Prisma } from '@prisma/client'

export const categoryDro: Prisma.CategorySelect = {
	id: true,
	name: true
}