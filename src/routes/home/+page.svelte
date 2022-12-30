<script lang="ts">
	import { goto } from '$app/navigation';
	import Navigation from '$lib/utils/navigation';
	import { onMount } from 'svelte';

	import ContactComponent from '$lib/components/ContactComponent.svelte';
	import SoftwareKeys from '$lib/components/SoftwareKeys.svelte';

	onMount(() => {
		Navigation.selectFirstElement();
	});

	const handleSelectingContact = () => {
		const element = Navigation.getSelectedElement();
		if (element) {
			const phone = element.getAttribute('data-phone');
			const count = element.getAttribute('data-count');
			if (count && Number(count) > 0) {
				goto(`/messages/${phone}`);
			} else {
				goto(`/messages/${phone}/new`);
			}
		}
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'Enter':
				// Handle selecting a contact
				handleSelectingContact();
				return;
			case 'ArrowDown':
				return Navigation.Down();
			case 'ArrowUp':
				return Navigation.Up();
			default:
				return;
		}
	};
</script>

<main class="pb-7">
	<ul>
		<li>
			<ContactComponent
				src="/uttrr.svg"
				phone="1234567890"
				datetime="2021-01-01 12:00 AM"
				count={0}
			/>
		</li>
	</ul>
	<div class="flex items-center space-x-2 bg-divider px-2 py-1 text-white">
		<img src="/clock.svg" alt="clock" class="h-3.5 w-3.5" />
		<h2 class="text-sm">Recent</h2>
	</div>
	<ul>
		<li>
			<ContactComponent
				src="/uttrr.svg"
				phone="1234567890"
				datetime="2021-01-01 12:00 AM"
				count={1}
			/>
		</li>
	</ul>
	<div class="flex items-center space-x-2 bg-divider px-2 py-1 text-white">
		<img src="/contacts.svg" alt="clock" class="h-3.5 w-3.5" />
		<h2 class="text-sm">Contacts</h2>
	</div>
	<ul>
		<li>
			<ContactComponent
				src="/uttrr.svg"
				phone="1234567890"
				datetime="2021-01-01 12:00 AM"
				count={1}
			/>
		</li>
	</ul>
	<SoftwareKeys>
		<div slot="center" class="flex justify-center">
			<img class="h-4 w-4" src="/tick.svg" alt="ok" />
		</div>
	</SoftwareKeys>
</main>

<svelte:window on:keydown={handleKeyDown} />
