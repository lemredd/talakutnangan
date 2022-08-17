import type { Pipe as BasePipe } from "$/types/database"
import type { BaseManagerClass } from "!/types/independent"

export interface NullableConstraints { nullable?: { defaultValue: any } }

export interface BooleanConstraints { boolean?: { loose: boolean } }

export interface IntegerConstraints { integer?: { mustCast: boolean } }

export interface LengthConstraints { length: { minimum?: number, maximum?: number } }

export interface RangeConstraints { range: { minimum?: number, maximum?: number } }

export interface SameRuleConstraints {
	same: {
		value?: any,
		pointer?: string
	}
}

export interface OneOfRuleConstraints { oneOf: { values: any[] } }

export interface RegexRuleConstraints { regex: { match: RegExp } }

export interface ArrayRuleConstraints {
	array: Rules
}

export interface ObjectRuleConstraints {
	object: FieldRules
}

export interface ManagerBasedRuleConstraints {
	manager: {
		className: BaseManagerClass,
		columnName: string
	}
}

export interface UniqueRuleConstraints extends ManagerBasedRuleConstraints {
	unique: {
		IDPath: string
	}
}

export interface AcronymRuleConstraints {
	acronym: {
		spelledOutPath: string
	}
}

export interface BufferRuleConstraints {
	buffer: {
		allowedMimeTypes: string[],
		maxSize: number
	}
}

export interface NotRuleConstraints {
	not: Rules
}

/**
 * Union of rule contraints
 */
export type RuleContraints = Partial<
	& NullableConstraints
	& BooleanConstraints
	& IntegerConstraints
	& LengthConstraints
	& RangeConstraints
	& SameRuleConstraints
	& OneOfRuleConstraints
	& ArrayRuleConstraints
	& ObjectRuleConstraints
	& ManagerBasedRuleConstraints
	& UniqueRuleConstraints
	& AcronymRuleConstraints
	& BufferRuleConstraints
	& RegexRuleConstraints
	& NotRuleConstraints
>

/**
 * Shape of validation constraints
 */
export interface ValidationConstraints<T = any> extends RuleContraints {
	request: T,
	source: any,
	field: string
}

/**
 * Shape of validation state
 */
export interface ValidationState {
	value: any,
	// If true, other rules should be skipped.
	maySkip: boolean
}

/**
 * Shape of validation pipes
 */
export type Pipe = BasePipe<Promise<ValidationState>, ValidationConstraints>

/**
 * Shape of validation rules
 */
export interface Rules {
	pipes: Pipe[],
	constraints?: RuleContraints
}

/**
 * Shape of validation rules for all fields
 */
export interface FieldRules {
	[key:string]: Rules
}
