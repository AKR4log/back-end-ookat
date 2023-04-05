import {
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { Auth } from './decorators/auth.decorator'
import { ConfirmSmsDto } from './dto/confrim-sms.dto'
import { PushSmsDto } from './dto/push-sms-dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post('login/access-token')
	async getNewTokens(@Body() dto: RefreshTokenDto) {
		return this.authService.getNewTokens(dto)
	}

	@UsePipes(new ValidationPipe())
	@Post('push-sms')
	async pushSMS(@Body() dto: PushSmsDto) {
		return this.authService.sendCode(dto)
	}

	@UsePipes(new ValidationPipe())
	@Post('confirm-sms')
	async confirmSMS(@Body() dto: ConfirmSmsDto) {
		return this.authService.confirmCode(dto)
	}
}
