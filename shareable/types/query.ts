import type { Message } from "$/types/message"
import type { Serializable } from "$/types/general"
import type { UserKind, Day } from "$/types/database"

export interface ExistenceFilter extends Serializable {
	filter: {
		existence: "exists" | "archived" | "*"
	}
}

export interface SlugFilter extends Serializable {
	filter: {
		slug: string
	}
}

export interface DepartmentFilter<T extends number|string = string> extends Serializable {
	filter: {
		/**
		 * ID of the department to filter on
		 */
		department: "*"|T
	}
}

export interface NullableDepartmentFilter<T extends number|string = string> extends Serializable {
	filter: {
		departmentID: "*"|null|T
	}
}

export interface RoleFilter<T extends number|string = string> extends Serializable {
	filter: {
		/**
		 * ID of the role to filter on
		 */
		role: "*"|T
	}
}

export interface KindFilter extends Serializable {
	filter: {
		kind: "*"|UserKind
	}
}

export interface CriteriaFilter extends Serializable {
	filter: {
		criteria: "*"|"incomplete"|"verified"|"unverified"
	}
}

export interface IDsFilter<T extends number|string = string> extends Serializable {
	filter: {
		IDs?: T[]
	}
}

export interface UserFilter<T extends number|string = string> extends Serializable {
	filter: {
		/**
		 * ID of the user to filter on
		 */
		user: T
	}
}

export interface PostFilter<T extends number|string = string> extends Serializable {
	filter: {
		postID: T
	}
}

export interface EmployeeScheduleDayFilter extends Serializable {
	filter: {
		/**
		 * The day where employee schedules are available.
		 */
		day: "*"|Day
	}
}

export interface EmployeeScheduleRangeFilter extends Serializable {
	filter: {
		/**
		 * The time range where employee schedules are available.
		 */
		employeeScheduleRange: "*"|{
			end: number,
			start: number
		}
	}
}

export interface ConsultationRangeFilter extends Serializable {
	filter: {
		/**
		 * The time range where consultation schedules are available.
		 */
		consultationScheduleRange: "*"|{
			end: Date,
			begin: Date
		}
	}
}

export interface DateTimeRangeFilter extends Serializable {
	filter: {
		/**
		 * The time range where consultation schedules are available.
		 */
		dateTimeRange: {
			end: Date,
			begin: Date
		}
	}
}

export interface ConsultationFilter<T extends number|string = string> extends Serializable {
	filter: {
		/**
		 * ID of the consultations to filter on. If none is provided, it selects all consultations.
		 */
		consultationIDs?: T[]
	}
}

export interface ChatMessageKindFilter extends Serializable {
	filter: {
		/**
		 * Kind of messages to get from server
		 */
		chatMessageKinds: "*"|Message["kind"][]
	}
}

export interface PreviewMessageOnlyFilter extends Serializable {
	filter: {
		/**
		 * Setting this to true ignores most query parameters and returns last messages of each
		 * consultation specified on other filters.
		 */
		previewMessageOnly: boolean
	}
}

/**
 * Shape of expected common filter options
 */
export type CommonFilter = ExistenceFilter

/**
 * Expected shape of the common sort options
 */
export interface Sort extends Serializable {
	sort: string[]
}

/**
 * Expected shape of the common page offset
 */
export interface PageOffset {
	page: {
		offset: number
	}
}

/**
 * Expected shape of the common page options
 */
export type Page = PageOffset & {
	page: {
		limit: number
	}
}

export type CommonQueryParameters =
	& Page
	& Sort
	& CommonFilter

export type UserQueryParameters<T extends number|string = string> =
	& CommonQueryParameters
	& DepartmentFilter<T>
	& RoleFilter<T>
	& KindFilter
	& SlugFilter

export type RoleQueryParameters<T extends number|string = string> =
	& CommonQueryParameters
	& DepartmentFilter<T>
	& IDsFilter<T>
	& SlugFilter

export type DepartmentQueryParameters<T extends number|string = string> =
	& CommonQueryParameters
	& IDsFilter<T>
	& SlugFilter

export type EmployeeScheduleQueryParameters<T extends number|string = string> =
	& CommonQueryParameters
	& UserFilter<T>
	& EmployeeScheduleRangeFilter
	& EmployeeScheduleDayFilter

export type ConsultationQueryParameters<T extends number|string = string> =
	& CommonQueryParameters
	& UserFilter<T>
	& ConsultationRangeFilter

export type ChatMessageActivityQueryParameters<T extends number|string = string> =
	& CommonQueryParameters
	& ConsultationFilter<T>

export type ChatMessageQueryParameters<T extends number|string = string> =
	& CommonQueryParameters
	& ConsultationFilter<T>
	& ChatMessageKindFilter
	& PreviewMessageOnlyFilter

export type PostQueryParameters<T extends number|string = string> =
	& CommonQueryParameters
	& NullableDepartmentFilter<T>

export type TimeSumQueryParameters<T extends number|string = string> =
	& CommonQueryParameters
	& DateTimeRangeFilter
	& UserFilter<T>

export type CommentQueryParameters<T extends number|string = string> =
	& CommonQueryParameters
	& PostFilter<T>
	& IDsFilter<T>

export type IDOnlyParameters<T extends number|string = string> =
	& CommonQueryParameters
	& IDsFilter<T>
