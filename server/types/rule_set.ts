import type { BaseManagerClass } from "!/types/dependent"
import type { FieldRules, Rules, Pipe } from "!/types/validation"

export type IdentifierDocumentOptions = Partial<{
	postIDRules: Rules
	extraIdentifierQueries: FieldRules
	extraQueries: FieldRules
}>

export interface Relationship{
	isArray: boolean,
	relationshipName: string,
	validator: Pipe,
	ClassName: BaseManagerClass,
	typeName?: string,
	options?: Partial<{
		postIDRules: Rules
		extraIdentifierQueries: FieldRules
		extraQueries: FieldRules
	}>
}
