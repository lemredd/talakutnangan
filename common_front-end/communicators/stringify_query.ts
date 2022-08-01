import { stringify } from "qs"

export default function(query: object): string {
	return stringify(query)
}
