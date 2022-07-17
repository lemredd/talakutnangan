import type { UserProfile } from "$/types/common_front-end"
import extractEmailUsername from "!/helpers/extract_email_username"

/**
 * Helper function to generate default password.
 *
 * ! If there is a change below, update `!/app/routes/api/user/import.post` too.
 *
 * @param userProfile Profile of the user where to derive the password.
 */
export default function(userProfile: UserProfile): string {
	if (userProfile.data.kind === "student") {
		return userProfile.data.studentDetail.data.studentNumber
	} else {
		return extractEmailUsername(userProfile.data.email)
	}
}
