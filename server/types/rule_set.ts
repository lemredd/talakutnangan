import type { FieldRules, Rules } from "!/types/validation"

export type IdentifierDocumentOptions = Partial<{
	postIDRules: Rules
	extraIdentifierQueries: FieldRules
	extraQueries: FieldRules
}>
