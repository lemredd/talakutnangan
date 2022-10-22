<template>
	<div class="post-container">
		<Viewer v-model="post"/>
		<CreateField :post="post"/>
		<Multiviewer v-model="comments"/>
	</div>
</template>

<style lang="scss">
</style>

<script setup lang="ts">
import { provide, inject, ref, computed } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedPostResource } from "$/types/documents/post"
import type { DeserializedCommentResource } from "$/types/documents/comment"

import makeSwitch from "$@/helpers/make_switch"

import Multiviewer from "@/comment/multiviewer.vue"
import Viewer from "@/post/multiviewer/viewer.vue"
import CreateField from "@/comment/create_field.vue"

type RequiredExtraProps =
	| "userProfile"
	| "post"
	| "comments"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const { userProfile } = pageProps
const post = ref<DeserializedPostResource<"poster"|"posterRole"|"department">>(
	pageProps.post.data as DeserializedPostResource<"poster"|"posterRole"|"department">
)
const comments = ref<DeserializedCommentResource<"user"|"parentComment">[]>(
	pageProps.comments.data as DeserializedCommentResource<"user"|"parentComment">[]
)

</script>
