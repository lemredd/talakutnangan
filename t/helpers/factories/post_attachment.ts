import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type { FileLikeTransformerOptions } from "%/types/independent"
import type {
	PostAttachmentResource,
	PostAttachmentDocument,
	PostAttachmentAttributes,
	PostAttachmentListDocument,
	PostAttachmentResourceIdentifier,
	DeserializedPostAttachmentResource,
	DeserializedPostAttachmentDocument,
	DeserializedPostAttachmentListDocument
} from "$/types/documents/post_attachment"

import Post from "%/models/post"
import FileLikeFactory from "~/factories/file-like"
import PostAttachment from "%/models/post_attachment"
import PostAttachmentTransformer from "%/transformers/post_attachment"

export default class PostAttachmentFactory extends FileLikeFactory<
	PostAttachment,
	PostAttachmentResourceIdentifier<"read">,
	PostAttachmentAttributes<"raw">,
	PostAttachmentAttributes<"raw">,
	PostAttachmentResource<"read", "raw">,
	DeserializedPostAttachmentResource<"raw">,
	PostAttachmentDocument<"read", "raw">,
	PostAttachmentListDocument<"read", "raw">,
	DeserializedPostAttachmentDocument<"raw">,
	DeserializedPostAttachmentListDocument<"raw">,
	FileLikeTransformerOptions
> {
	postGenerator: () => Promise<Post|null> = () => Promise.resolve(null)
	fileTypeGenerator: () => string = () => "text/plain"

	get model(): ModelCtor<PostAttachment> { return PostAttachment }

	get transformer(): PostAttachmentTransformer { return new PostAttachmentTransformer() }

	async generate(): GeneratedData<PostAttachment> {
		return {
			"fileContents": this.fileContentsGenerator(),
			"fileType": this.fileTypeGenerator(),
			"userID": (await this.postGenerator())?.id ?? null
		}
	}

	post(generator: () => Promise<Post>): PostAttachmentFactory {
		this.postGenerator = generator
		return this
	}

	fileType(generator: () => string): PostAttachmentFactory {
		this.fileTypeGenerator = generator
		return this
	}
}
