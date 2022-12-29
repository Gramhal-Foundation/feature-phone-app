<script lang="ts">
	import { goto } from '$app/navigation';
	import ContactComponent from '$lib/components/ContactComponent.svelte';
	import Navigation from '$lib/utils/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		Navigation.selectFirstElement();
	});

	const handleSelectingContact = () => {
		const element = Navigation.getSelectedElement();
		if (element) {
			const phone = element.getAttribute('data-phone');
			const count = element.getAttribute('data-count');
			const messageId = element.getAttribute('data-message-id');
			if (count && Number(count) > 0) {
				goto(`/messages/${phone}/${messageId}`);
			} else {
				goto(`/messages/${phone}`);
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

<main>
	<ul>
		<li>
			<ContactComponent
				src="/uttrr.svg"
				phone="1234567890"
				datetime="2021-01-01 12:00 AM"
				count={0}
				messageId="123"
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
				messageId="123"
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
				messageId="123"
			/>
		</li>
	</ul>
</main>

<svelte:window on:keydown={handleKeyDown} />
