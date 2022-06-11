<template>
<ul class="tabs">
	<li
		v-for="(_, tab) in tabs"
		:key="tab"
		:class="['tab-button', { 'active': currentTab === tab }]"
		@click="setCurrentTab(tab)">
		{{ tab }}
	</li>
</ul>
<component :is="tabs[currentTab]" class="tab" :userInfo="userInfo"></component>
</template>

<style scoped lang="scss">
.tabs {
	border-bottom: 1px solid #888;
	padding-bottom: 1em;

	display: flex;

	.tab-button {
		border-radius: 5px;
		cursor: pointer;
		padding: 0.25em 2em;

		&.active {
			background-color: white;
			color: black;
		}
	}
}
</style>

<script setup lang="ts">
import { defineComponent, inject, Ref, ref } from "vue"

const { tabs } = defineProps<{
	tabs: {
		[key: string]: ReturnType<typeof defineComponent>
	}
}>()

const currentTab = ref("Account")
const userInfo = inject("userInfo") as Ref<{ [key:string]: any }>

function setCurrentTab(tab: ReturnType<typeof defineComponent>) {
	currentTab.value = tab
}
</script>
