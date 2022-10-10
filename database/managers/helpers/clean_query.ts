export default function(dirtyQuery: string): string {
	const cleanedQuery = dirtyQuery.replace(/(\t|\n)+/mgu, "")

	return cleanedQuery
}
