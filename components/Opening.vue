<template>
<div class="text-center">
	<h1 class="p-5 text-1.5rem">
		Insert phrase here.
	</h1>
	<p class="px-5 text-0.75rem">
		Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum aliquid illo vel possimus suscipit consequuntur maxime doloremque explicabo tenetur dolor.
	</p>

	<div class="graphics">
		<Person accessory="chat" type="talking left"/>
		<Person accessory="chat" type="talking right"/>

	</div>
</div>

<div class="text-center">
	<h1 class="p-5 text-1.5rem">
		Insert phrase here.
	</h1>
	<p class="px-5 text-0.75rem">
		Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum aliquid illo vel possimus suscipit consequuntur maxime doloremque explicabo tenetur dolor.
	</p>

	<div class="graphics graphics-left">
		<Person accessory="campaign" type="announce"/>
	</div>
</div>
</template>
<style scoped lang="scss">
.graphics {
	display: flex;
	justify-content: center;

	margin-top:4em;
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
import Person from "@/Person.vue"
</script>
