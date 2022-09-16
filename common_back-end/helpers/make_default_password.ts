import type { DeserializedUserProfile } from "$/types/documents/user"
import extractEmailUsername from "$!/helpers/extract_email_username"

/**
 * Helper function to generate default password.
 *
 * ! If there is a change below, update `!%/api/user/import.post` too.
 *
 * @param userProfile Profile of the user where to derive the password.
 */
export default function(userProfile: DeserializedUserProfile): string {
	if (userProfile.data.kind === "student") {
		const castUserProfile = userProfile as DeserializedUserProfile<"studentDetail">
		return castUserProfile.data.studentDetail.data.studentNumber
	}

	return extractEmailUsername(userProfile.data.email)
}
