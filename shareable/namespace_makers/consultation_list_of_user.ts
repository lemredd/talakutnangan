import specializePath from "$/helpers/specialize_path"

export default function(userID: string): string {
	return specializePath("/user/:userID/consultation", {
		userID
	})
}
