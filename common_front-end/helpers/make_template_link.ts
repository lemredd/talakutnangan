import { FetcherLinks } from "$@/types/independent"

export default function(prefix: string, type: string): FetcherLinks {
	return {
		"bound": `${prefix}/${type}`,
		"unbound": `${prefix}/${type}/:id`
	}
}
