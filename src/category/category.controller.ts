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
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CategoryService } from './category.service'
import { CategoryDto } from './dto/category.dto'

@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get()
	async getAllCategory() {
		return this.categoryService.getAll()
	}

	@Get(':id')
	@Auth()
	async getById(@Param('id') id: string) {
		return this.categoryService.byId(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	async updateCategory(@Param('id') id: string, @Body() dto: CategoryDto) {
		return this.categoryService.updateCategory(id, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(201)
	@Post()
	async createCategory(@Body() dro: CategoryDto) {
		return this.categoryService.createCategory(dro)
	}

	@HttpCode(200)
	@Delete(':id')
	async deleteCategory(@Param('id') id: string) {
		return this.categoryService.deteleCategory(id)
	}
}