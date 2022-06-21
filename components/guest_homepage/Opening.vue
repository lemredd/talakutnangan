<template>
<img src="./Logo.svg" alt="logo" />
<div class="text-center">
	<Description>
		<template #header>Chat header</template>
		<template #details>The quick brown fox jumped over the lazy dog.</template>
	</Description>
	<div class="graphics">
		<Person accessory="chat" variant="talking left"/>
		<Person accessory="chat" variant="talking right"/>

	</div>
</div>

<div class="text-center">
	<Description>
		<template #header>Forum Header</template>
		<template #details>
			Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim, alias?
		</template>
	</Description>
	<div class="graphics graphics-left">
		<Person accessory="campaign" variant="announce"/>
	</div>
</div>
</template>
<style scoped lang="scss">
.graphics {
	display: flex;
	justify-content: center;

	margin-top:4em;
}
.logo {
			padding: .25em;
			display: flex;
			align-items: center;
			width: max-content;

			img {
				width: 300px;
				padding: .5em;
				display: flex;
				align-items: center;
			}
}



@media screen and (min-width: 768px) {
	.graphics {
		justify-content: flex-end;

		&.graphics-left {
			justify-content: flex-start;
		}
	}
}


</style>

<script lang="ts" setup>
import Person from "@/guest_homepage/opening/Person.vue"
import Description from "@/guest_homepage/opening/Description.vue"
</script>
