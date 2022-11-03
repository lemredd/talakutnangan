<template>
	<div class="instruction forum">
		<h1 class="text-center">
			What are features in forum?
		</h1>
		<div class="flex flex-col md:flex-row justify-center md:justify-around">
			<div class="ttl text right-auto py-3">
				<p>1. Students and Employees can view, comment and post on the Forum.</p>
				<p>
					2. Employees can now limit in the comments
					on the following post that is created..
				</p>
				<p>
					3. Students and Employees can now use Vote
					for any particular post on the employees.
				</p>
				<p>
					4. Also votes will determine that how many
					students or employees are agree or disagree.
				</p>
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
	<div class="instruction chat">
		<h1 class="text-center">
			What are features in consultation?
		</h1>
		<div class="flex flex-col md:flex-row justify-center md:justify-around">
			<div class="ttl text right-auto py-3 md:order-2">
				<p>
					1. In Consultations, Student will create a consult
					and typing the named of a employee.
				</p>
				<p>2. Consultations will only last 15mins in every consultations that is created.</p>
				<p>3. Students can now specify on the reasons.</p>
				<p>4. Students can select time and date of an employee when to consult.</p>
				<p>5. Students and Employees can interact on chat in consultations.</p>
				<p>
					6. Students and Employees can send documents,
					video and pictures on their consultation.
				</p>
				<p>7. Students and Employees also can use Video-Calling.</p>
				<p>
					8. Students and Employees can end their consultation
					if there is no more following questions.
				</p>
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

<style scoped lang="scss">
.invert {
	transform: scaleX(-1);
}

.instruction {
	@apply bg-light-800 dark:bg-dark-200;
	margin-bottom: 1.25em;
	border-radius: 1.5em;
	padding: 1.25em;
}
</style>

<script setup lang="ts">
import Person from "./opening/Person.vue"
</script>
