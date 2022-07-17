import type { UserProfile } from "$/types/common_front-end"

/**
 * Helper function to generate default password.
 * @param userProfile Profile of the user where to derive the password.
 */
export default function(userProfile: UserProfile): string {
	if (userProfile.data.kind === "student") {
		return userProfile.data.studentDetail.studentNumber
	} else {
		return userProfile.data.email.split("@")[0]
	}
}
