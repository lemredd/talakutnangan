import type { GeneralObject } from "$/types/general"
import type { Pipe as BasePipe } from "$/types/database"
import type BasePermissionGroup from "$/permissions/base"
import type { BaseManagerClass, Request } from "!/types/dependent"

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

export interface IsGreaterThanRuleConstraints {
	isGreaterThan: { value: any } | { pointer: string }
}

export interface OneOfRuleConstraints { oneOf: { values: any[] } }

export interface RegexRuleConstraints { regex: { match: RegExp } }

export interface ArrayRuleConstraints {
	// eslint-disable-next-line no-use-before-define
	array: Rules
}

export interface ObjectRuleConstraints {
	// eslint-disable-next-line no-use-before-define
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
		maximumSize: number,
		minimumSize: number
	}
}

export interface NotRuleConstraints {
	// eslint-disable-next-line no-use-before-define
	not: Rules
}

export interface OrRuleConstraints {
	or: {
		// eslint-disable-next-line no-use-before-define
		rules: Rules[]
	}
}

export interface ValidateExtensivelyIfRuleConstraints {
	validateExtensivelyIf: {
		condition: (data: {
			value: any,
			request: Request,
			source: GeneralObject
		}) => Promise<boolean>,
		// eslint-disable-next-line no-use-before-define
		rules: Rules
	}
}

export interface UniqueEmployeeScheduleRuleConstraint {
	uniqueEmployeeSchedule: {
		userIDPointer: string,
		employeeScheduleIDPointer?: string
	}
}

export interface RestorableEmployeeScheduleConstraints extends ManagerBasedRuleConstraints {
	restorableEmployeeSchedule: {
		userIDPointer: string
	}
}

export interface ExistWithSameAttributeConstraint extends ManagerBasedRuleConstraints {
	sameAttribute: {
		columnName: string,
		pointer?: string
		value?: any,
	}
}

export interface UniqueConsultationScheduleConstraints {
	uniqueConsultationSchedule: {
		userIDPointer: string,
		conflictConfirmationPointer: string
	}
}

export interface DoesBelongToCurrentUserConstraints<U> extends ManagerBasedRuleConstraints {
	doesBelongToCurrentUser?: {
		permissionGroup: BasePermissionGroup<any, U>,
		anyPermissionCombinationForBypass: U[][]
	}
}

export interface SizeConstraints { size: { minimum?: number, maximum?: number } }

export interface DivisibleByConstraints {
	divisibleBy: {
		value: number
	}
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
	& IsGreaterThanRuleConstraints
	& OneOfRuleConstraints
	& ArrayRuleConstraints
	& ObjectRuleConstraints
	& ManagerBasedRuleConstraints
	& UniqueRuleConstraints
	& AcronymRuleConstraints
	& BufferRuleConstraints
	& RegexRuleConstraints
	& NotRuleConstraints
	& UniqueEmployeeScheduleRuleConstraint
	& ExistWithSameAttributeConstraint
	& SizeConstraints
	& RestorableEmployeeScheduleConstraints
	& UniqueConsultationScheduleConstraints
	& DoesBelongToCurrentUserConstraints<unknown>
	& OrRuleConstraints
	& DivisibleByConstraints
	& ValidateExtensivelyIfRuleConstraints
>

/**
 * Shape of validation constraints
 */
export interface ValidationConstraints<T = any> extends RuleContraints {
	request: T,
	source: any,
	field: string,
	friendlyName?: string
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
	constraints?: RuleContraints,
	friendlyName?: string
}

/**
 * Shape of validation rules for all fields
 */
export interface FieldRules {
	[key:string]: Rules
}
