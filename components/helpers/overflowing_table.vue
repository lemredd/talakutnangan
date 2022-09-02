<template>
	<div class="overflowing-table">
		<table>
			<thead>
				<tr>
					<slot name="table-headers"></slot>
				</tr>
			</thead>

			<tbody>
				<slot name="table-body"></slot>
			</tbody>
		</table>
	</div>
</template>

<style scoped lang="scss">
.overflowing-table {
	overflow-x: scroll;

	table {
		width: 100%;

		th, td {
			text-align: center;
		}
	}
}
</style>

<script setup lang="ts">

</script>
