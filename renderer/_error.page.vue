<template>
	<div class ="main" v-if="is404">
		<div class="box-column">
			<div class="error-header">
					<div class="line">
						<p class="error-number">404</p>
					</div>
				<p class="error-text">Page Not Found</p>
			</div>
			<p class ="details">This page could not be found.</p>
		</div>
	</div>
	<div class ="main" v-else>
		<div class="box-column">
			<div class="error-header">
					<div class="line">
						<p class="error-number" v-if="pageContext.pageProps.parsedUnitError === null">500</p>
						<p class="error-number" v-else>{{ pageContext.pageProps.parsedUnitError.status }}</p>
					</div>
				<p class="error-text" v-if="pageContext.pageProps.parsedUnitError === null">Internal Server Error</p>
				<p class="error-text" v-else>{{ pageContext.pageProps.parsedUnitError.title }}</p>
			</div>
			<p class="details" v-if="pageContext.pageProps.parsedUnitError === null">Something went wrong.</p>
			<p class="details" v-else>
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
import { usePageContext } from "#/usePageContext"

defineProps(["is404"])

const pageContext = usePageContext()
</script>
