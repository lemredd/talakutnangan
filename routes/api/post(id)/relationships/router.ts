import { controllers as postAttachmentControllers }
	from "!%/api/post(id)/relationships/post_attachment/router"
import { controllers as tagControllers }
	from "!%/api/post(id)/relationships/tag/router"

export const controllers = [
	...postAttachmentControllers,
	...tagControllers
]
