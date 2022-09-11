export default function(value: any): value is number {
	return typeof value === "number"
}
