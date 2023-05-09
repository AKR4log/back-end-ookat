import { Prisma } from '@prisma/client'

export const productDro: Prisma.ProductSelect = {
	id: true,
	name: true,
    description: true,
	images: true,
	// price: true,
	// user: {
	// 	select: {
	// 		id: true,
	// 		name: true,
	// 		avatarPath: true
	// 	}
	// }
}
