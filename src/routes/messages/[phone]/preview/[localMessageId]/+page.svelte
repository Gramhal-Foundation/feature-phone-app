<script lang="ts">
	import { page } from '$app/stores';

	import SoftwareKeys from '$lib/components/SoftwareKeys.svelte';

	let playing = false;
</script>

<main class="flex h-screen flex-col bg-primary pb-7">
	<section class="flex flex-col items-center space-y-4 py-4 px-4">
		<div class="flex flex-col items-center">
			<img src="/uttrr.svg" alt="logo" class="h-16 w-16" />
			<h1 class="text-center text-lg font-semibold text-white">{$page.params.phone}</h1>
		</div>

		<img src="/speaker.svg" alt="speaker" class="h-12 w-12" class:animate-pulse={playing} />
	</section>
	<SoftwareKeys>
		<div slot="left" class="flex items-center justify-start">
			<img class="h-4 w-4" src="/cancel.svg" alt="back" />
		</div>
		<div slot="center" class="flex items-center justify-center">
			{#if playing}
				<img class="h-4 w-4" src="/pause.svg" alt="pause" />
			{:else}
				<img class="h-4 w-4" src="/speaker.svg" alt="play" />
			{/if}
		</div>
		<div slot="right" class="flex items-center justify-end">
			<img class="h-4 w-4" src="/tick.svg" alt="ok" />
		</div>
	</SoftwareKeys>
</main>
