import type { RawRole } from "$/types/database"
import type { ModelCtor } from "%/types/dependent"
import type { GeneralObject } from "$/types/server"
import type { SignatureTransformerOptions } from "%/types/independent"

import Role from "%/models/signature"
import BaseManager from "%/managers/base"
import Signature from "%/transformers/signature"

export default class extends BaseManager<
	Role,
	RawRole,
	GeneralObject,
	SignatureTransformerOptions
> {
	get model(): ModelCtor<Role> { return Role }

	get transformer(): Signature { return new Signature() }
}
