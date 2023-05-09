import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { User } from '@prisma/client'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { ProductDto } from './dto/product.dto'
import { UpdateProductDto } from './dto/updateProduct.dto'
import { ProductService } from './product.service'

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Get()
	async getAllProduct() {
		return this.productService.getAll()
	}

	@Get(':id')
	async getById(@Param('id') id: string) {
		return this.productService.byId(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(201)
	@Auth()
	@Post()
	async createProduct(@CurrentUser() user: User, @Body() dro: ProductDto) {
		if (user.role.includes('SELLER') || user.role.includes('ADMIN')) {
			return this.productService.createProduct(user, dro)
		} else throw new ForbiddenException()
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(201)
	@Auth()
	@Put(':id')
	async updateProduct(
		@CurrentUser() user: User,
		@Param('id') id: string,
		@Body() dto: UpdateProductDto
	) {
		if (user.role.includes('SELLER') || user.role.includes('ADMIN')) {
			return this.productService.updateProduct(id, dto)
		} else throw new ForbiddenException()
	}

	@HttpCode(200)
	@Auth()
	@Delete(':id')
	async deleteProduct(@CurrentUser() user: User, @Param('id') id: string) {
		if (user.role.includes('SELLER') || user.role.includes('ADMIN')) {
			return this.productService.deteleProduct(id)
		} else throw new ForbiddenException()
	}
}
