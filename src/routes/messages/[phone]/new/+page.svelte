<script lang="ts">
	import { page } from '$app/stores';

	import SoftwareKeys from '$lib/components/SoftwareKeys.svelte';

	let recording = false;
	let time = 60;

	const handleKeyDown = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'Enter':
				recording = !recording;
				if (recording) {
					const interval = setInterval(() => {
						time--;
						if (time === 0) {
							clearInterval(interval);
							recording = false;
							time = 60;
						}
					}, 1000);
				} else {
					time = 60;
				}
				return;
			default:
				return;
		}
	};
</script>

<main class="flex h-screen flex-col bg-primary pb-7">
	<section class="flex flex-col items-center space-y-4 py-4 px-4">
		<div class="flex flex-col items-center">
			<img src="/uttrr.svg" alt="logo" class="h-16 w-16" />
			<h1 class="text-center text-lg font-semibold text-white">{$page.params.phone}</h1>
		</div>
		{#if recording}
			<img src="/mic.svg" alt="mic" class="h-12 w-12 animate-pulse" />
			<span class="text-center text-white">{time}</span>
		{/if}
	</section>
	<SoftwareKeys>
		<div slot="center" class="flex items-center justify-center">
			{#if recording}
				<img class="h-4 w-4" src="/tick.svg" alt="finish" />
			{:else}
				<img class="h-4 w-4" src="/mic.svg" alt="record" />
			{/if}
		</div>
	</SoftwareKeys>
</main>

<svelte:window on:keydown={handleKeyDown} />
