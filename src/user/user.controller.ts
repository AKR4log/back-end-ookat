import {
	Controller,
	Get,
	HttpCode,
	Patch,
	Query
} from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { Auth } from '../auth/decorators/auth.decorator'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@CurrentUser('id') userId: string) {
		return this.userService.byId(userId)
	}

	// @UsePipes(new ValidationPipe())
	// @HttpCode(200)
	// @Put('profile')
	// @Auth()
	// async updateProfile(@CurrentUser('id') userId: string, @Body() dto: UserDto) {
	// 	return this.userService.updateProfile(userId, dto)
	// }

	@HttpCode(200)
	@Patch('profile')
	@Auth()
	async toggleFavorite(
		@CurrentUser('id') userId: string,
		@Query('favoriteProductId') favoriteProductId: string
	) {
		return this.userService.toggleFavorite(userId, favoriteProductId)
	}
}