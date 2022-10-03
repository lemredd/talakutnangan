export default function(number: number) {
	const twoDigitStart = 10
	return number < twoDigitStart ? `0${number}` : number.toString()
}
