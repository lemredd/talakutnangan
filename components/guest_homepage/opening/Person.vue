<template>
<div :class="`person-${variant}`">
    <span class="material-icons person">person</span>
    <span v-if="accessory" class="material-icons accessory" :class="accessory">{{accessory}}</span>
</div>

</template>

<style scoped lang="scss">

.person-talking, .person-announce {
	position: relative;
}
.person-talking, .person-announce, .person-default  {

	.person {
		font-size: 15vw;
	}
	.chat {
		position: absolute;
		top: 0; right: -5px;
		font-size: 5vw;
	}
	.campaign {
		position: absolute;
		top: -5px; right: -30px;
		font-size: 10vw;
		transform: rotate(-20deg);
	}
	&.left {
		margin-right: 3vw;
	}
	&.right {
		transform: scaleX(-1);
	}
}

@media screen and (min-width: 768px) {
    .person {
		font-size: 150px !important;
	}
	.chat {
		font-size: 45px !important;
	}
	.campaign {
		font-size: 80px !important;
	}

	.left {
		margin-right: 2em !important;
	}

}
</style>

<script setup lang="ts">
defineProps<{
    variant: string,
    accessory?: string
}>()
</script>
