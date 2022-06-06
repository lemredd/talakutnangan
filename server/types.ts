import { Router, RequestHandler } from "express"

import User from "%/models/user"
import type { Method as BaseMethod } from "!/types/independent"
export type Method = BaseMethod
/**
 * Determines the type of current environment where the script is running
 */
export enum Environment {
	Production,
	Development,
	UnitTest,
	IntegrationTest
}

/**
 * Type to combine with `Request` type to get the session
 */
export interface WithSession {
	session: {
		token: string|null
	}
}

/**
 * Type to combine with `Request` type to get the possible user
 */
export interface WithPossibleUser extends WithSession {
	user: User|null,
	isAuthenticated: () => boolean
}

/**
 * Type to combine with `Request` type to get the authenticated user
 */
export interface WithUser extends WithSession {
	user: User,
	logout: () => void
}

/**
 * Type to combine with `Request` type to do registration
 */
export interface WithRegistration extends WithSession {
	body: {
		email: string,
		password: string,
		kind: "unreachable employee" | "reachable employee" | "student"
	}
}

/**
 * Type returned by the route managers
 */
export interface Routers {
	/**
	 * Router that can be prefixed by the parent route manager.
	 */
	main: Router,

	/**
	 * Router that cannot be prefixed by the parent route manager. It will be based possibly in in
	 * root route.
	 */
	special?: Router
}

/**
 * Possible kinds of user that the system can handle
 */
export enum UserKind {
	UnreachableEmployee = "unreachable_employee",
	ReachableEmployee = "reachable_employee",
	Student = "student"
}

/**
 * Used to group information about a certain route and its handlers.
 */
export interface Route {
	method: Method,
	URL: string,
	handlers: RequestHandler[]
}

/**
 * Mostly-based on `TableColumnOptions` where name and type is optional.
 */
export interface PartialTableColumnOptions {
	name?: string,
	type?: string,
	default?: any,
	isNullable?: boolean,
	isGenerated?: boolean,
	generationStrategy?: "uuid" | "increment",
	isPrimary?: boolean,
	isUnique?: boolean,
	length?: string,
	precision?: number | null,
	scale?: number,
	enum?: string[]
}

/*
 * Used to pass information where the controller extends a class that has predetermined HTTP method
 */
export interface RawURLInfo {
	baseURL: string,
	overridesPrefix?: boolean
}

/**
 * Used to pass information where the controller can be accessed.
 */
export interface RawRoute extends RawURLInfo {
	method: Method,
}

/**
 * Used to return as an output by validation methods in non-GET controllers
 */
export interface ValidationError {
	field: string,
	message: string
}
