import type Transformer from "%/transformers/base"

export type Subtransformer = {
	attribute: string,
	transformer: Transformer<any, any>
}

export type OptionalSubtransformerList = (Subtransformer|null)[]

export type SubtransformerList = Subtransformer[]
