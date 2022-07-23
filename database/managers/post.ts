import { Op } from "sequelize"

import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type { Criteria, CommonConstraints, RawPost, Pipe } from "$/types/database"

import Post from "%/models/post"
import PostTransformer from "%/transformers/post"
import hash from "!/helpers/auth/hash"
import BaseManager from "%/managers/base"
import compare from "!/helpers/auth/compare"
import Department from "%/models/department"
import limit from "%/managers/helpers/limit"
import searchName from "%/managers/helpers/search_name"
import offset from "%/managers/helpers/offset"

export default class PostManager extends BaseManager<Post, RawPost> {
	get model(): ModelCtor<Post> { return Post }

	get transformer(): PostTransformer { return new PostTransformer() }

    get listPipeline(): Pipe<FindAndCountOptions<Post>, CommonConstraints>[] {
		return [
			searchName,
			offset,
			limit
		]
	}

}