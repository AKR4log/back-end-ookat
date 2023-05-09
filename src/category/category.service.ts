import { Injectable } from '@nestjs/common'
import { NotFoundException } from '@nestjs/common/exceptions'
import { PrismaService } from 'src/prisma.service'
import { categoryDro } from './dro/category.dro'
import { CategoryDto } from './dto/category.dto'

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}

	async byId(id: string) {
		const category = await this.prisma.category.findUnique({
			where: { id: id },
			select: categoryDro
		})

		if (!category) throw new NotFoundException('Category not found')
		return category
	}

	async createCategory(dto: CategoryDto) {
		return this.prisma.category.create({ data: { ...dto } })
	}

	async createSubCategory(dto: CategoryDto) {
		return this.prisma.subCategory.create({ data: { ...dto } })
	}

	async updateCategory(id: string, dto: CategoryDto) {
		return this.prisma.category.update({ where: { id: id }, data: { ...dto } })
	}

	async deteleCategory(id: string) {
		return this.prisma.category.delete({ where: { id: id } })
	}

	async getAll() {
		return this.prisma.category.findMany({ select: categoryDro })
	}
}