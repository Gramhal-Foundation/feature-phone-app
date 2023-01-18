<script lang="ts">
	import { goto } from '$app/navigation';
	import Navigation from '$lib/utils/navigation';
	import { onMount, tick } from 'svelte';
	import ContactComponent from '$lib/components/ContactComponent.svelte';
	import SoftwareKeys from '$lib/components/SoftwareKeys.svelte';
	import axiosInstance from '$lib/utils/axios';
	import toast from 'svelte-french-toast';
	import { getLocale } from '$lib/utils';

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

	interface Translations {
		recent: string;
		contacts: string;
		messagesFetchError: string;
		inviteMessage: string;
	}

	let recentConversations: Message[] = [];
	let userMessageCount: number = 0;
	let usersPhone: string = '7760032885';
	let userMessageDateTime: string | null = null;
	let pageLoading: boolean = true;
	let translations: Translations | null = null;

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
			toast.error(translations?.messagesFetchError ?? 'Error fetching recent conversations');
		}
	};

	onMount(() => {
		// Set translations
		const lang = getLocale();
		pageLoading = true;
		axiosInstance
			.get(`translations/${lang}/home`)
			.then((res) => {
				translations = res.data;
			})
			.catch((err) => {
				console.error('There was an error while fetching language data: ', err);
			})
			.finally(async () => {
				pageLoading = false;
				// https://svelte.dev/tutorial/tick
				await tick();
				// Set navigation
				Navigation.selectFirstElement();
			});

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
			const invite = element.getAttribute('data-invite');
			if (count && Number(count) > 0 && invite !== 'true') {
				goto(`/messages/${phone}`);
			} else if (invite === 'true') {
				// Open sms app to invite user
				const element = document.createElement('a');
				element.setAttribute(
					'href',
					`sms:${phone}?body=${encodeURI(
						translations?.inviteMessage ??
							`Hey, I'm using Uttrr. It's a great app to send messages to your friends and family. You can download it from https://uttrr.com`
					)}`
				);
				element.click();
			} else {
				goto(`/messages/${phone}/new`);
			}
		}
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		// Prevent default behavior of arrow keys when page is loading
		if (pageLoading) return;
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

{#if !pageLoading}
	<main class="h-full">
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
			<h2 class="text-sm">{translations?.recent ?? 'Recent'}</h2>
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
			<h2 class="text-sm">{translations?.contacts ?? 'Contacts'}</h2>
		</div>
		<ul>
			<li>
				<ContactComponent
					src="/uttrr.svg"
					phone="9899272513"
					datetime="2021-01-01 12:00 AM"
					count={0}
					invite={true}
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
			<div slot="right" class="flex justify-end">
				<img class="h-4 w-4" src="/trash.svg" alt="back" />
			</div>
		</SoftwareKeys>
	</main>
{/if}
<svelte:window on:keydown={handleKeyDown} />
