/**
 * Basic requirement for messages.
 */
export interface GeneralMessage {
	type: string
}

/**
 * Shape of text messages.
 */
export interface TextMessage extends GeneralMessage {
	type: "text",
	data: string
}

/**
 * Union of all kinds of messages.
 */
export type Message = TextMessage
