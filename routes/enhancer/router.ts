import Router from "!/bases/router"
import ControllerLike from "!/bases/controller-like"
import instantiateSimultaneously from "!/helpers/instantiate_simultaneously"

import GetIndex from "!%/enhancer/index.get"
import { controllers as userControllers } from "!%/enhancer/user/router"
import { controllers as roleControllers } from "!%/enhancer/role/router"
import { controllers as postControllers } from "!%/enhancer/post/router"
import { controllers as forumControllers } from "!%/enhancer/forum/router"
import { controllers as departmentControllers } from "!%/enhancer/department/router"
import { controllers as userSettingsControllers } from "!%/enhancer/settings/router"
import { controllers as consultationControllers } from "!%/enhancer/consultation/router"

export const controllers: (new() => ControllerLike)[] = [
	...userControllers,
	...roleControllers,
	...postControllers,
	...forumControllers,
	...departmentControllers,
	...consultationControllers,
	...userSettingsControllers,
	GetIndex
]

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(instantiateSimultaneously([
			...userControllers,
			...roleControllers,
			...postControllers,
			...forumControllers,
			...departmentControllers,
			...consultationControllers,
			...userSettingsControllers,
			GetIndex
		] as (new() => ControllerLike)[]))
	}
}
