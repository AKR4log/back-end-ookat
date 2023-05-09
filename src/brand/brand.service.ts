import { Injectable } from '@nestjs/common'
import { NotFoundException } from '@nestjs/common/exceptions'
import { PrismaService } from 'src/prisma.service'
import { brandDro } from './dro/brand.dro'
import { BrandDto } from './dto/brand.dto'
@Injectable()
export class BrandService {
	constructor(private prisma: PrismaService) {}

	async byId(id: string) {
		const brand = await this.prisma.brand.findUnique({
			where: { id: id },
			select: brandDro
		})

		if (!brand) throw new NotFoundException('Brand not found')
		return brand
	}

	async createBrand(dto: BrandDto) {
		return this.prisma.brand.create({ data: { ...dto } })
	}

	async updateBrand(id: string, dto: BrandDto) {
		return this.prisma.brand.update({ where: { id: id }, data: { ...dto } })
	}

	async deteleBrand(id: string) {
		return this.prisma.brand.delete({ where: { id: id } })
	}

	async getAll() {
		return this.prisma.brand.findMany({ select: brandDro })
	}
}
