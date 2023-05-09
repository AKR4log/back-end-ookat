import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'
import { BrandService } from './brand.service'
import { BrandDto } from './dto/brand.dto'

@Controller('brand')
export class BrandController {
	constructor(private readonly brandService: BrandService) {}

	@Get()
	async getAllBrand() {
		return this.brandService.getAll()
	}

	@Get(':id')
	async getById(@Param('id') id: string) {
		return this.brandService.byId(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	async updateBrand(@Param('id') id: string, @Body() dto: BrandDto) {
		return this.brandService.updateBrand(id, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(201)
	@Post()
	async createBrand(@Body() dro: BrandDto) {
		return this.brandService.createBrand(dro)
	}

	@HttpCode(200)
	@Delete(':id')
	async deleteBrand(@Param('id') id: string) {
		return this.brandService.deteleBrand(id)
	}
}