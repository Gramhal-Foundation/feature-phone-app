<script lang="ts">
	import { goto } from '$app/navigation';
	import Navigation from '$lib/utils/navigation';
	import { onMount } from 'svelte';

	import ContactComponent from '$lib/components/ContactComponent.svelte';
	import SoftwareKeys from '$lib/components/SoftwareKeys.svelte';
	import axiosInstance from '$lib/utils/axios';
	import toast, { Toaster } from 'svelte-french-toast';

	let recentConversations: Message[] = [];
	let userMessageCount: number = 0;
	let usersPhone: string = '7760032885';
	let userMessageDateTime: string | null = null;

	interface Message {
		max_timestamp: any;
		mobile_number: string;
		name: string;
		unread_count: number;
		user_id: string;
		last_message_at: string;
	}

	interface HomeMessages {
		messages: Message[];
	}

	const fetchRecentConversations = async () => {
		try {
			const { data } = await axiosInstance.get<HomeMessages>('/home');
			const userMessageIndex = data.messages.findIndex(
				(message) => message.mobile_number === usersPhone
			);
			const userMessage = data.messages[userMessageIndex];
			// Remove user message from recent conversations
			data.messages.splice(userMessageIndex, 1);
			if (userMessage) {
				userMessageCount = userMessage.unread_count;
				userMessageDateTime = userMessage.last_message_at;
			}
			recentConversations = data.messages;
		} catch (error) {
			console.log(error);
			toast.error('Error fetching recent conversations');
		}
	};

	onMount(() => {
		Navigation.selectFirstElement();

		// Fetch recent conversations
		fetchRecentConversations();

		// Automatically refresh recent conversations every 5 seconds
		let recentConversationsInterval = setInterval(fetchRecentConversations, 5000);

		return () => {
			// Clear interval on unmount to prevent memory leaks of recent conversations
			clearInterval(recentConversationsInterval);
		};
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
				event.preventDefault();
				return Navigation.Down();
			case 'ArrowUp':
				event.preventDefault();
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
				phone={usersPhone}
				datetime={userMessageDateTime}
				count={userMessageCount}
			/>
		</li>
	</ul>
	<div class="flex items-center space-x-2 bg-divider px-2 py-1 text-white">
		<img src="/clock.svg" alt="clock" class="h-3.5 w-3.5" />
		<h2 class="text-sm">Recent</h2>
	</div>
	<ul>
		{#each recentConversations as conversation}
			<li>
				<ContactComponent
					src="/uttrr.svg"
					phone={conversation.mobile_number}
					datetime={conversation.last_message_at}
					count={conversation.unread_count}
				/>
			</li>
		{/each}
	</ul>
	<div class="flex items-center space-x-2 bg-divider px-2 py-1 text-white">
		<img src="/contacts.svg" alt="clock" class="h-3.5 w-3.5" />
		<h2 class="text-sm">Contacts</h2>
	</div>
	<ul>
		<li>
			<ContactComponent
				src="/uttrr.svg"
				phone="9899272513"
				datetime="2021-01-01 12:00 AM"
				count={0}
			/>
		</li>
		<li>
			<ContactComponent
				src="/uttrr.svg"
				phone="9844641240"
				datetime="2021-01-01 12:00 AM"
				count={0}
			/>
		</li>
		<li>
			<ContactComponent
				src="/uttrr.svg"
				phone="8879911320"
				datetime="2021-01-01 12:00 AM"
				count={0}
			/>
		</li>
		<li>
			<ContactComponent
				src="/uttrr.svg"
				phone="7760032885"
				datetime="2021-01-01 12:00 AM"
				count={0}
			/>
		</li>
	</ul>
	<SoftwareKeys>
		<div slot="center" class="flex justify-center">
			<img class="h-4 w-4" src="/tick.svg" alt="ok" />
		</div>
	</SoftwareKeys>
</main>

<Toaster />

<svelte:window on:keydown={handleKeyDown} />
