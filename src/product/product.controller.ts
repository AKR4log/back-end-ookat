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
		return this.productService.createProduct(user, dro)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(201)
	@Auth()
	@Put(':id')
	async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
		return this.productService.updateProduct(id, dto)
	}

	@HttpCode(200)
	@Auth()
	@Delete(':id')
	async deleteProduct(@Param('id') id: string) {
		return this.productService.deteleProduct(id)
	}
}
