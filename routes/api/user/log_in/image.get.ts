import type { OptionalMiddleware } from "!/types/independent"

import { IMAGE_FILE_IDS, IMAGE_FILE_COUNT, DRIVE_LINK } from "!/constants/image_file_ids"

import Policy from "!/bases/policy"
import Validation from "!/bases/validation"
import specializePath from "$/helpers/specialize_path"
import Controller from "!/bases/controller-likes/controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import DynamicGatedRedirector from "!/middlewares/miscellaneous/dynamic_gated_redirector"

export default class extends Controller {
	get filePath(): string { return __filename }

	get policy(): Policy { return CommonMiddlewareList.guestOnlyPolicy }

	get bodyParser(): null { return null }

	get validations(): Validation[] { return [] }

	get middlewares(): OptionalMiddleware[] {
		return [
			...super.middlewares,
			new DynamicGatedRedirector(() => Promise.resolve({
				"location": specializePath(DRIVE_LINK, {
					"id": IMAGE_FILE_IDS[Math.floor(Math.random() * IMAGE_FILE_COUNT)]
				})
			}))
		]
	}

	handle(): Promise<void> {
		return Promise.resolve()
	}
}
