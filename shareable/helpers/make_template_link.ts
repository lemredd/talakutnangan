import { FetcherLinks } from "$/types/general"

export default function(prefix: string, type: string): FetcherLinks {
	return {
		"bound": `${prefix}/${type}/:id`,
		"query": `${prefix}/${type}?:query`,
		type,
		"unbound": `${prefix}/${type}`
	}
}
