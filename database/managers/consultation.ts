import type { ModelCtor } from "%/types/dependent"
import type { Serializable } from "$/types/general"
import type { CommonQueryParameters } from "$/types/query"
import type {
	ConsultationAttributes,
	ConsultationResourceIdentifier
} from "$/types/documents/consultation"

import User from "%/models/user"
import BaseManager from "%/managers/base"
import trimRight from "$/helpers/trim_right"
import Consultation from "%/models/consultation"
import Condition from "%/managers/helpers/condition"
import ConsultationTransformer from "%/transformers/consultation"

export default class  extends BaseManager<Consultation, ConsultationAttributes, CommonQueryParameters> {
	get model(): ModelCtor<Consultation> { return Consultation }

	get transformer(): ConsultationTransformer { return new ConsultationTransformer() }

}
