import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'
import { PrismaService } from 'src/prisma.service'
import { productDro } from 'src/product/dro/product.dro'

@WebSocketGateway()
export class Gateway {
	constructor(private prisma: PrismaService) {}

	@SubscribeMessage('getProducts')
	getProducts() {
		return this.prisma.product.findMany({ select: productDro })
	}
}
