import { IsEmail, IsString } from 'class-validator'

export class AuthAdmDto {
	@IsEmail()
	email: string

	@IsString()
	password: string
}
