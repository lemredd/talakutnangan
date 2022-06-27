import { Request, Response } from "!/types/dependent"

import UserFactory from "~/factories/user"
import UserTransformer from "%/transformers/user"
import Serializer from "%/transformers/serializer"
import DevController from "!/common_controllers/dev_controller"

export default class extends DevController {
	get filePath(): string { return __filename }

	async handle(request: Request, response: Response): Promise<void> {
		const list = await new UserFactory().makeMany(25)
		const transformer = new UserTransformer()

		const serializedList = Serializer.serialize(list, transformer, {})

		response.status(this.status.OK).json(serializedList)
	}
}
