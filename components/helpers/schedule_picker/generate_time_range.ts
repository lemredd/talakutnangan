import twoDigits from "@/helpers/schedule_picker/two_digits"

type Limitations = {
	"hour"?: {
		"start": number
		"end": number
	},
	"minute"?: {
		"start": number
		"end": number
	}
}

export default function(limitations?: Limitations) {
	const hourEnd = 11
	const minuteEnd = 60
	const start = 0
	const time = []

	for (let i = start; i <= hourEnd; i++) {
		for (let interval = 15, j = start; j < minuteEnd; j += interval) {
			time.push(`${i === 0 ? hourEnd + 1 : twoDigits(i)}:${twoDigits(j)}`)
		}
	}

	return time
}
