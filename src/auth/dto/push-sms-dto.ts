import { IsString } from 'class-validator'

export class PushSmsDto {
	@IsString()
	phone: string
}