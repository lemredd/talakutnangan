import type { Pipe } from "$/types/database"
import type { BaseManagerClass } from "!/types/independent"

export interface NullableConstraints { nullable?: { defaultValue: any } }

export interface BooleanConstraints { boolean?: { loose: boolean } }

export interface LengthConstraints { length: { minimum?: number, maximum?: number } }

export interface RangeConstraints { range: { minimum?: number, maximum?: number } }

export interface SameRuleConstraints { same: any }

export interface OneOfRuleConstraints { oneOf: { values: any[] } }

export interface RegexRuleConstraints { regex: { match: RegExp } }

export interface ArrayRuleConstraints {
	array: {
		rules: Rules
	}
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

/**
 * Union of rule contraints
 */
export type RuleContraints = Partial<
	& NullableConstraints
	& BooleanConstraints
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
 * Shape of validation rules
 */
export interface Rules {
	pipes: Pipe<Promise<ValidationState>, ValidationConstraints>[],
	constraints: RuleContraints
}

/**
 * Shape of validation rules for all fields
 */
export interface FieldRules {
	[key:string]: Rules
}

/**
 * Shape of validation constraints that are not part of main info.
 *
 * They are usually used internally.
 */
export interface MetaValidationConstraints {
	transformer?: Function
}
