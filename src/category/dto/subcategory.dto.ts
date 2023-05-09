import { IsOptional, IsString } from 'class-validator'

export class SubCategoryDto {
	@IsString()
	categoryId: string

	@IsString()
	name: string

	@IsString()
	@IsOptional()
	avatarPath: string
}