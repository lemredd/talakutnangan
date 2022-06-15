import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"

import User from "%/models/user"
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
				done(null, false, "User not found")
			} else {
				done(null, foundUser)
			}
		}
	))

	// @ts-ignore
	passport.serializeUser((user: User, done: (error: any, id: number) => void): void => {
		done(null, user.id)
	})

	passport.deserializeUser(async (id: number, done: Function) => {
		const manager = new UserManager()

		const user = await manager.findWithID(id)

		return done(null, user)
	})
}
