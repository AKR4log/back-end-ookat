import { IsString } from 'class-validator'

export class ConfirmSmsDto {
	@IsString()
	code: string

    @IsString()
	token: string
}