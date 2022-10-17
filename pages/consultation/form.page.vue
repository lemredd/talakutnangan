<template>
	<div>
		<section class="header">
			<h1>Enter the consultation details</h1>
		</section>

		<section class="default">
			<input
				class="consultant required"
				header="Consultant"
				text-field-label="Type the employee to add"
				kind="reachable_employee"/>

			<div class="required">
				<select
					class="consultant-roles"
					label="Address consultant as:">
				</select>
			</div>

			<input
				class="consulters"
				header="Consulters"
				text-field-label="Type the students to add"
				kind="student"/>

			<div class="required">
				<select
					class="reason"
					label="Kind of Reason: "
					placeholder="Choose your reason"></select>
			</div>

			<input
				class="other-reason required"
				label="What are the other reasons(s)?"
				type="text"/>
			<div class="schedule-selector">
				<div class="consultant-has-schedules">
					<p>Please select the day and time from the consultant's available schedules</p>
					<div class="required">
						<select class="selectable-day" label="Day:"></select>
						<div class="selectable date-picker">
							<span>Select a date:</span>
							<input type="date" value=""/>
						</div>
					</div>

					<div>
						<select
							class="selectable-time"
							label="Time:">
						</select>
					</div>
				</div>
			</div>
		</section>

		<section class="footer">
		</section>
	</div>
</template>

<style>
</style>

<script setup lang="ts">

</script>
