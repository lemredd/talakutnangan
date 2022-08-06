export default function sanitizeArray(array: any[]) {
	return array.filter(Boolean)
}
