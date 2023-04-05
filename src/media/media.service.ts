import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { S3 } from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class MediaService {
	async saveMedia(mediaFile: Express.Multer.File, user: User, folder: string) {
		const customUrl = user.id + '/' + folder + '/' + uuidv4() + '.jpg'

		const s3 = new S3({
			credentials: {
				accessKeyId: '222560_akr4log',
				secretAccessKey: 'adY3jvma3_'
			},
			endpoint: 'https://s3.storage.selcloud.ru',
			s3ForcePathStyle: true,
			region: 'ru-1',
			apiVersion: 'latest'
		})

		const params = {
			Bucket: 'images',
			Key: customUrl,
			Body: mediaFile.buffer,
			ContentType: 'image/jpeg'
		}

		return new Promise((resolve, reject) => {
			s3.upload(params, (err, data) => {
				if (err) {
					reject(err.message)
				}
				resolve({
					url: 'https://api.selcdn.ru/v1/SEL_222560/images/' + customUrl,
					userId: user.id
				})
			})
		})
	}
}
