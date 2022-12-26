<script lang="ts">
	import { goto } from '$app/navigation';
	import SoftwareKeys from '$lib/components/SoftwareKeys.svelte';

	const handleKeyDown = (evt: KeyboardEvent) => {
		switch (evt.key) {
			case 'ArrowRight':
			case 'SoftRight':
				// TODO: Make an API call to send OTP
				return goto('/otp/verify');
			default:
				return;
		}
	};
</script>

<main class="grid h-screen w-screen grid-rows-3">
	<section class="row-span-1 flex items-center justify-center bg-primary">
		<h2 class="font-semibold text-white">Enter Phone Number</h2>
	</section>
	<section class="row-span-2 bg-white p-4">
		<div class="mt-4">
			<label for="phone" class="sr-only">Phone</label>
			<input
				type="text"
				name="phone"
				id="phone"
				class="border-gray-300 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
				placeholder="1234567890"
			/>
		</div>
	</section>
	<SoftwareKeys>
		<div slot="right" class="flex justify-end text-white">
			<img class="h-4 w-4" src="/tick.svg" alt="ok" />
		</div>
	</SoftwareKeys>
</main>

<svelte:window on:keydown={handleKeyDown} />
