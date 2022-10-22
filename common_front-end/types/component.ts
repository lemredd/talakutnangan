import type { ExternalPermissionDependencyInfo } from "$/types/permission"

import PermissionGroup from "$/permissions/base"

export interface OptionInfo {
	// Value of the option to render
	value: string,

	// Text to be shown to the user representing the option. Uses `value` if it does not exists.
	label?: string
}

export interface TabInfo {
	"label": string,
	"path": string
}

export interface FlagSelectorInfo {
	"header": string,
	"permissionGroup": PermissionGroup<any, any>,
	"dependentGroups": PermissionGroup<any, any>[],
	"uncheckExternal": (dependencies: ExternalPermissionDependencyInfo<any, any>[]) => void,
	"checkExternal": (dependencies: ExternalPermissionDependencyInfo<any, any>[]) => void
}

export type FieldStatus =
	| "enabled"
	| "disabled"
	| "unlocked"
	| "locked"
