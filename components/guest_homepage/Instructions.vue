<template>
	<div class="forum bg-dark-200 w-auto rounded-3xl h-auto p-5 mb-5">
		<h1 class="text-center">Participate in a forum</h1>
		<div class="flex flex-col md:flex-row justify-center md:justify-around">
			<div class="ttl text right-auto py-3">
				<p>1. lorem ipsum.</p>
				<p>2. dolor sit amet.</p>
				<p>3. consectetur adipisicing elit.</p>
				<p>4. add more steps if necesarry</p>
			</div>
			<div class="left-auto w-min h-min flex self-center pt-2">
				<div class="crowd flex flex-row items-stretch">
					<Person variant="default" class="self-center"/>
					<div class="self-center justify-center ml-[-0.25em]">
						<Person variant="default"/>
						<Person variant="default"/>
					</div>
				</div>
				<Person
				class="ml-[3em]"
					variant="announce"
					accessory="campaign"
					style="transform: scaleX(-1);"/>
			</div>
		</div>
	</div>
	<div class="chat bg-dark-200 w-auto rounded-3xl h-auto p-5 mb-5">
		<h1 class="text-center">Start a consultation</h1>
		<div class="flex flex-col md:flex-row justify-center md:justify-around">
			<div class="ttl text right-auto py-3 md:order-2">
				<p>1. lorem ipsum.</p>
				<p>2. dolor sit amet.</p>
				<p>3. consectetur adipisicing elit.</p>
				<p>4. add more steps if necesarry</p>
			</div>
			<div class="pt-2 order-2 md:order-1 flex self-center justify-between">
				<Person
					class="mr-5"
					variant="talking"
					accessory="chat"/>
				<Person
					class="invert ml-5"
					variant="talking"
					accessory="chat"/>
			</div>
		</div>
	</div>

</template>

<style>
.invert {
	transform: scaleX(-1);
}
</style>

<script setup lang="ts">
import Person from './opening/Person.vue';
</script>
