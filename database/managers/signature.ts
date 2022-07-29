import type { GeneralObject } from "$/types/server"
import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type { CommonConstraints, RawRole, Pipe } from "$/types/database"

import Role from "%/models/signature"
import BaseManager from "%/managers/base"
import Signature from "%/transformers/signature"

export default class extends BaseManager<Role, RawRole, GeneralObject, { raw: boolean }> {
	get model(): ModelCtor<Role> { return Role }

	get transformer(): Signature { return new Signature() }
}
