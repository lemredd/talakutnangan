import type { Serializable } from "$/types/general"

import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"

import Log from "$!/singletons/log"
import UserManager from "%/managers/user"
import UserProfileTransformer from "%/transformers/user_profile"

// eslint-disable-next-line require-await
export default async function(): Promise<void> {
	passport.use(new LocalStrategy(
		{
			"passwordField": "password",
			"usernameField": "email"
		},
		async(email: string, password: string, done: (...allArguments: any) => void) => {
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

		const castUserData = user.data as Serializable
		done(null, castUserData.id as number)
	})

	passport.deserializeUser(async(id: number, done: (...allArguments: any) => void) => {
		const manager = new UserManager()

		const user = await manager.findWithID(id, {
			"transformer": new UserProfileTransformer()
		})

		Log.success("middleware", "deserializing user from session")

		return done(null, user)
	})
}
