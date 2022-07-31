import type { UserKind } from "$/types/database"
import type { Serializable } from "$/types/general"

/**
 * Shape of expected common filter options
 */
 export type CommonFilter = ExistenceFilter

 export type UserQueryFilter =
	 & CommonFilter
	 & DepartmentFilter
	 & RoleFilter
	 & KindFilter
	 & SlugFilter

export type RoleQueryFilter =
	 & CommonFilter
	 & DepartmentFilter

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

 export interface DepartmentFilter extends Serializable {
	 filter: {
		 department: "*"|string
	 }
 }

 export interface RoleFilter extends Serializable {
	 filter: {
		 role: "*"|string
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

 /**
  * Expected shape of the common sort options
  */
 export interface Sort extends Serializable {
	 sort: string[]
 }

 /**
  * Expected shape of the common page options
  */
 export interface Page {
	 page: {
		 offset: number,
		 limit: number
	 }
 }

 export type CommonQueryParameters =
	 & Page
	 & Sort
	 & CommonFilter