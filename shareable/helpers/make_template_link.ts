import { FetcherLinks } from "$/types/general"

export default function(prefix: string, type: string): FetcherLinks {
	return {
		"bound": `${prefix}/${type}`,
		"unbound": `${prefix}/${type}/:id`
	}
}
