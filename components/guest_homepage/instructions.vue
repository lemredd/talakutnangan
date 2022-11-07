<!-- eslint-disable max-len -->
<template>
	<div class="instruction consultation">
		<h1 class="instruction-header">
			What are the features of consultation?
		</h1>
		<div class="instructions-container">
			<ul class="instructions-list">
				<li class="instruction-item">
					<p>In Consultations, the Student will create a consult and type the name of an employee.</p>
				</li>
				<li class="instruction-item">
					<p>Students can specify the reasons.</p>
				</li>
				<li class="instruction-item">
					<p>Students can select the time and date of an employee when to consult.</p>
				</li>
				<li class="instruction-item">
					<p>Students and Employees can interact on chat in consultations.</p>
				</li>
				<li class="instruction-item">
					<p>Students and Employees can send documents, videos, and pictures during their consultation.</p>
				</li>
				<li class="instruction-item">
					<p>Students and Employees also can use Video-Calling.</p>
				</li>
				<li class="instruction-item">
					<p>Students and Employees can end their consultation if there are no more questions.</p>
				</li>
				<li class="instruction-item">
					<p>
						Consultations will end automatically after 5 minutes of inactivity in every consultation that was started.
					</p>
				</li>

				<span class="instruction-director">Start consulting <a href="/consultation">here</a></span>
			</ul>
			<div class="people consultation">
				<Person
					class="person-1"
					variant="talking"
					accessory="chat"/>
				<Person
					class="invert ml-5"
					variant="talking"
					accessory="chat"/>
			</div>
		</div>
	</div>
	<div class="instruction forum">
		<h1 class="instruction-header">
			What are the features in forum?
		</h1>
		<div class="instructions-container">
			<ul class="instructions-list">
				<li class="instruction-item">
					<p>
						Students and Employees can view, comment, and post on the Forum.
					</p>
				</li>
				<li class="instruction-item">
					<p>
						Employees can limit the comments on the following post that is created.
					</p>
				</li>
				<li class="instruction-item">
					<p>
						Students and Employees can use Vote for any particular post on the employees.
					</p>
				</li>
				<li class="instruction-item">
					<p>
						Also votes will determine that how many students or employees are agree or disagree.
					</p>
				</li>
			</ul>
			<div class="people">
				<div class="crowd">
					<Person variant="default" class="self-center"/>
					<div>
						<Person variant="default"/>
						<Person variant="default"/>
					</div>
				</div>
				<Person
					class="announcer"
					variant="announce"
					accessory="campaign"/>
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

	&.consultation {
		.instruction-header {
			@apply md:text-right;
		}

		.instructions-list {
			@apply md:order-2;
			@apply right-auto;
		}

		.people {
			@apply pt-2 order-2 md:order-1 flex self-center justify-between;

			.person-1 {
				@apply mr-5;
				@screen md {
					transform:
					scale(1.35)
					translateY(-60px);
				}
			}
		}
	}

	&.forum {
		.people {
			@apply left-auto w-min h-min flex self-center pt-2;

			.crowd {
				@apply flex flex-row items-stretch;
				@screen md {
					transform:
						scale(0.55)
						translate(-40px, -50px);
				}
			}

			.announcer {
				@apply ml-8;
				transform: scaleX(-1);

				@screen md {
					@apply m-0;
					transform:
						scale(-1.35, 1.35)
						translate(20px, 30px);
					}
				}
		}
	}

	.instruction-header {
		@apply md:text-2xl my-4;
	}

	.instructions-container {
		@apply flex flex-col md:flex-row justify-center md:justify-around;

		.instructions-list {
			@apply <md:mx-4;
			@apply ttl py-3 list-disc list-outside;

			.instruction-item {
				@apply md:mb-4;
			}

			.instruction-director {
				@apply mt-8;
				a { text-decoration: underline; }
			}
		}
	}
}
</style>

<script setup lang="ts">
import Person from "./opening/Person.vue"
</script>
