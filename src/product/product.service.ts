import { Injectable, NotFoundException } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { productDro } from './dro/product.dro'
import { ProductDto } from './dto/product.dto'
import { UpdateProductDto } from './dto/updateProduct.dto'

@Injectable()
export class ProductService {
	constructor(private prisma: PrismaService) {}

	async byId(id: string) {
		const product = await this.prisma.product.findUnique({
			where: { id: id },
			select: productDro
		})

		if (!product) throw new NotFoundException('Product not found')
		return product
	}

	async createProduct(user: User, dto: ProductDto) {
		try {
			const product = await this.prisma.product.create({
				data: {
					name: dto.name,
					categoryId: dto.categoryId,
					// price: dto.price,
					description: dto.description
					// userId: user.id
				}
			})

			return { product }
		} catch (e) {
			return { error: e }
		}
	}

	async updateProduct(productId: string, dto: UpdateProductDto) {
		try {
			const product = await this.prisma.product.findUnique({
				where: { id: productId }
			})

			if (!product) throw new NotFoundException('Product not found')

			const updateProduct = await this.prisma.product.update({
				where: { id: productId },
				data: {
					...dto
				}
			})

			return { updateProduct }
		} catch (e) {
			return { error: e }
		}
	}

	async deteleProduct(id: string) {
		return this.prisma.product.delete({ where: { id: id } })
	}

	async getAll() {
		return this.prisma.product.findMany({ select: productDro })
	}
}
