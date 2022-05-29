import passport from "passport"
import LocalStrategy from "passport-local"
import { EntityManager } from "typeorm"
import User from "%/models/user"
import searchUserByCredentials from "./search_user_by_credentials"

export default async function(manager: EntityManager) {
	passport.use(new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password"
		},
		(email: string, password: string, done: Function) => {
			searchUserByCredentials(manager, email, password).then(foundUser => {
				if (foundUser === null) {
					done(null, false, "User not found")
				} else {
					done(null, foundUser)
				}
			})
		}
	))

	passport.serializeUser((user: User, done: Function) => {
		return done(null, user.id)
	})

	passport.deserializeUser(async (id, done: Function) => {
		const user = await manager.findOneBy(User, { id })
		// TODO: encrypt user password
		return done(null, user)
	})
}
