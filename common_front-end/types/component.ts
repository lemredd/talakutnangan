export interface OptionInfo {
	// Value of the option to render
	value: string,

	// Text to be shown to the user representing the option. Uses `value` if it does not exists.
	label?: string
}

export interface TabInfo {
	"label": string,
	"path": string
}
