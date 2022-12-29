<script lang="ts">
	import { page } from '$app/stores';

	import SoftwareKeys from '$lib/components/SoftwareKeys.svelte';

	let recoding = false;
</script>

<main class="flex h-screen flex-col bg-primary pb-7">
	<section class="flex flex-col items-center space-y-4 py-4 px-4">
		<div class="flex flex-col items-center">
			<img src="/uttrr.svg" alt="logo" class="h-16 w-16" />
			<h1 class="text-center text-lg font-semibold text-white">{$page.params.phone}</h1>
		</div>
		{#if recoding}
			<img src="/mic.svg" alt="mic" class="h-16 w-16" />
		{/if}
	</section>
	<SoftwareKeys>
		<div slot="center" class="flex items-center justify-center">
			<img class="h-4 w-4" src="/mic.svg" alt="ok" />
		</div>
	</SoftwareKeys>
</main>
