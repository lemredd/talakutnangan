/**
 * @module IndependentCommonFrontEndTypes
 * @description This module contains types commonly originally used in front-end and do not depend
 * from other packages. However, they can be used by the other parts of the repository.
 */

 import type { Serializable, UserKind } from "$/types/database"

 /**
  * Shape of serialized roles
  */
 interface Roles extends Serializable {
	 data: (Serializable & {
		 type: "role",
		 id: number
	 })[]
 }

 /**
  * Shape of serialized user profile if authenticated
  */
 export interface UserProfile extends Serializable {
	 data: Serializable & {
		 type: "user",
		 id: number,
		 kind: UserKind,
		 roles: Roles
	 }
 }
