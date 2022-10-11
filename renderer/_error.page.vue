<template>
	<div v-if="is404" class="main">
		<div class="box-column">
			<div class="error-header">
				<div class="line">
					<p class="error-number">
						404
					</p>
				</div>
				<p class="error-text">
					Page Not Found
				</p>
			</div>
			<p class="details">
				This page could not be found.
			</p>
		</div>
	</div>
	<div v-else class="main">
		<div class="box-column">
			<div class="error-header">
				<div class="line">
					<p v-if="pageContext.pageProps.parsedUnitError === null" class="error-number">
						500
					</p>
					<p v-else class="error-number">
						{{ pageContext.pageProps.parsedUnitError.status }}
					</p>
				</div>
				<p v-if="pageContext.pageProps.parsedUnitError === null" class="error-text">
					Internal Server Error
				</p>
				<p v-else class="error-text">
					{{ pageContext.pageProps.parsedUnitError.title }}
				</p>
			</div>
			<p v-if="pageContext.pageProps.parsedUnitError === null" class="details">
				Something went wrong.
			</p>
			<p v-else class="details">
				[Error Code: {{ pageContext.pageProps.parsedUnitError.code }}]
				{{ pageContext.pageProps.parsedUnitError.detail }}
			</p>
			<!-- <p class ="details">
				JSON: {{ JSON.stringify(pageContext.pageProps.parsedUnitError) }}
			</p> -->
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "@styles/variables.scss";
.main {
	flex: 1 0 100%;
	margin-top: 6em;
}

.box-column{
	margin: auto;
	width: 100%;
	max-width: 640px;
	padding: 20px;
	border-radius: 25px;
  }

.error-header {
	@apply flex justify-center items-center;
	margin: auto;
	width: 100%;
	max-width: 640px;
	padding: 20px;
	border-radius: 25px;
	.line::after {
		content: " ";
	}
  }
.error-number{
	padding: 15px;
	font-family:Impact;
	font-size: max(min(15vw, 500px),15vw, 110px);
	color:#a1a1a1;
}
.error-text{
	padding: 15px;
	font-family:Impact;
	font-size: max(5vw, 30px);
	color:#a1a1a1;


}

.details{
	padding: 10px;
	font-family: "Cascadia Code";
	font-size: max(2vw, 15px);
	font-style: italic;
	font-weight: bold;
	text-align: center;
	color: $color-primary;
}

.line{
	border-right: 2px solid #d2cbcb;
	position:relative;
}


</style>
<script lang="ts" setup>
import { inject, onMounted } from "vue"

import type { PageContext } from "$/types/renderer"

import assignPath from "$@/external/assign_path"
import isUndefined from "$/type_guards/is_undefined"
import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"

defineProps<{
	"is404": boolean
}>()

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { pageProps } = pageContext
const { userProfile } = pageProps

const hasDefaultPassword = userProfile !== null
	&& !isUndefined(userProfile.meta.hasDefaultPassword)
	&& userProfile.meta.hasDefaultPassword

onMounted(() => {
	if (hasDefaultPassword) {
		setTimeout(() => {
			assignPath("/")
		}, convertTimeToMilliseconds("00:00:05"))
	}
})
</script>
