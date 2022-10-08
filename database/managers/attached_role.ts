import type { CommonQueryParameters } from "$/types/query"
import type { AttachedRoleAttributes } from "$/types/documents/attached_role"
import type {
	ModelCtor
} from "%/types/dependent"

import Model from "%/models/attached_role"
import BaseManager from "%/managers/base"
import Condition from "%/helpers/condition"
import Transformer from "%/transformers/attached_role"

export default class extends BaseManager<
	Model,
	AttachedRoleAttributes<"deserialized">,
	CommonQueryParameters
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	get exposableColumns(): string[] {
		return []
	}

	async findAttachedRole(userID: number, roleID: number): Promise<Model|null> {
		try {
			const attachedRole = await Model.findOne({
				"where": new Condition().and(
					new Condition().equal("userID", userID),
					new Condition().equal("roleID", roleID)
				).build(),
				...this.transaction.transactionObject
			})

			return attachedRole
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}
}
