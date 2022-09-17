import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import Post from "%/models/post"
import BaseManager from "%/helpers/base"
import PostTransformer from "%/transformers/post"

// export default class PostManager extends BaseManager<Post, RawPost> {
// 	get model(): ModelCtor<Post> { return Post }

// 	get transformer(): PostTransformer { return new PostTransformer() }
// }
