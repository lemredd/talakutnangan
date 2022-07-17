import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"

import type { Serializable } from "$/types/database"

import Log from "$!/singletons/log"
import UserManager from "%/managers/user"

export default async function() {
	passport.use(new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password"
		},
		async (email: string, password: string, done: Function) => {
			const manager = new UserManager()
			const foundUser = await manager.findWithCredentials(email, password)

			if (foundUser === null) {
				Log.errorMessage("middleware", "user cannot be found")

				done(null, false, "User not found")
			} else {
				Log.success("middleware", "user has been found")

				done(null, foundUser)
			}
		}
	))

	// @ts-ignore
	passport.serializeUser((user: Serializable, done: (error: any, id: number) => void): void => {
		Log.success("middleware", "serializing user for session")

		done(null, (user!.data as Serializable)!.id as number)
	})

	passport.deserializeUser(async (id: number, done: Function) => {
		const manager = new UserManager()

		const user = await manager.findWithID(id)

		Log.success("middleware", "deserializing user from session")

		return done(null, user)
	})
}
