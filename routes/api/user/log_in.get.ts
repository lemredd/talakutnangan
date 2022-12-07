import type { OptionalMiddleware } from "!/types/independent"

import { IMAGE_FILE_IDS, DRIVE_LINK } from "!/constants/image_file_ids"

import Policy from "!/bases/policy"
import Validation from "!/bases/validation"
import specializePath from "$/helpers/specialize_path"
import Controller from "!/bases/controller-likes/controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import ForceRedirector from "!/middlewares/miscellaneous/force_redirector"

export default class extends Controller {
	get filePath(): string { return __filename }

	get policy(): Policy { return CommonMiddlewareList.guestOnlyPolicy }

	get bodyParser(): null { return null }

	get validations(): Validation[] { return [] }

	get middlewares(): OptionalMiddleware[] {
		const link = specializePath(DRIVE_LINK, {
			"id": IMAGE_FILE_IDS[0]
		})

		return [
			...super.middlewares,
			new ForceRedirector(link)
		]
	}

	handle(): Promise<void> {
		return Promise.resolve()
	}
}
