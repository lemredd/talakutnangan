import type { BaseManagerClass } from "!/types/independent"
import type { FieldRules, Rules, Pipe } from "!/types/validation"

export type IdentifierDocumentOptions = Partial<{
	postIDRules: Rules
	extraIdentifierQueries: FieldRules
	extraQueries: FieldRules
}>

export interface Relationship{
	isArray: boolean,
	typeName: string,
	validator: Pipe,
	ClassName: BaseManagerClass,
	options?: Partial<{
		postIDRules: Rules
		extraIdentifierQueries: FieldRules
		extraQueries: FieldRules
	}>
}
