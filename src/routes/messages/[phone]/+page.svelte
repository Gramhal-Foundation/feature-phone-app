<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, tick } from 'svelte';

	import SoftwareKeys from '$lib/components/SoftwareKeys.svelte';
	import axiosInstance from '$lib/utils/axios';
	import toast from 'svelte-french-toast';
	import { goto } from '$app/navigation';
	import { getLocale } from '$lib/utils';

	interface Message {
		_id: string;
		data?: any;
		from_user_id: string;
		is_viewed: boolean;
		message_type: string;
		to_user_id: string;
		url: string;
		created_at: string;
		remaining: number;
	}

	interface MarkedAsReadResponse {
		message: string;
		next_chat: Message;
	}

	interface Translations {
		markingAsRead: string;
		markedAsRead: string;
		markAsReadError: string;
	}

	let playing = false;
	let player: HTMLAudioElement | null = null;
	let progress = 0;
	let currentMessage: Message | null = null;
	let loading: boolean = false;
	let translations: Translations | null = null;
	let pageLoading: boolean = true;

	onMount(() => {
		const lang = getLocale();
		pageLoading = true;
		axiosInstance
			.get<Translations>(`translations/${lang}/messages`)
			.then((res) => {
				translations = res.data;
			})
			.catch((err) => {
				console.error('There was an error while fetching language data: ', err);
			})
			.finally(async () => {
				pageLoading = false;
				await tick();
				player = document.querySelector('audio');
				if (!player) {
					return;
				} else {
					player.onpause = () => {
						playing = false;
					};
					player.onplay = () => {
						playing = true;
					};
					player.ontimeupdate = () => {
						// Calculate the progress in percentage
						progress = ((player?.currentTime ?? 0) / (player?.duration ?? 1)) * 100;
					};
					getNextMessage();
				}
			});
	});

	const getNextMessage = () => {
		loading = true;
		axiosInstance
			.get<Message>(`/get_message?from_user_mobile_number=${$page.params.phone}`)
			.then((res) => {
				if (res.data) {
					player?.setAttribute('src', res.data.url);
					currentMessage = res.data;
					if (!currentMessage?._id) {
						goto('/home');
					}
				}
			})
			.catch((err) => {
				console.log(err);
				toast.error('Something went wrong');
			});
		loading = false;
	};

	const markMessageAsRead = async (chatId: string, gotoHome: boolean = true) => {
		const res = await axiosInstance.post<MarkedAsReadResponse>(`/mark_read?chat_id=${chatId}`);
		if (res.data) {
			if (res.data.next_chat) {
				currentMessage = res.data.next_chat;
				if (player) {
					player.currentTime = 0;
					player.setAttribute('src', res.data.next_chat.url);
				}
			} else {
				if (gotoHome) {
					goto('/home');
				}
			}
		}
	};

	const handleKeyDown = async (event: KeyboardEvent) => {
		if (loading) return;
		switch (event.key) {
			case 'ArrowLeft':
			case 'SoftLeft':
				if (playing) {
					player?.pause();
				} else {
					player?.play();
				}
				return;
			case 'Enter':
				if (playing) {
					// TODO: Change the speaker type
				} else {
					// Go to recording page
					goto(`/messages/${$page.params.phone}/new`);
				}
				return;
			case 'ArrowRight':
			case 'SoftRight':
				player?.pause();
				loading = true;
				try {
					await toast.promise(markMessageAsRead(currentMessage?._id ?? ''), {
						loading: translations?.markingAsRead ?? 'Marking as read...',
						success: translations?.markedAsRead ?? 'Marked as read',
						error: translations?.markAsReadError ?? 'Error marking as read'
					});
				} catch (error) {
					console.error(error);
				}
				loading = false;
				return;
			default:
				return;
		}
	};
</script>

{#if !pageLoading}
	<main class="grid h-screen grid-rows-5">
		<section class="row-span-2 flex flex-col items-center space-y-4 bg-green py-4 px-4">
			<div class="flex flex-col items-center">
				<img src="/uttrr.svg" alt="logo" class="h-14 w-14" />
				<h1 class="text-center text-lg font-semibold text-white">{$page.params.phone}</h1>
			</div>
		</section>
		<section class="row-span-3 flex flex-col items-center justify-between p-4">
			<div class="flex w-full items-center justify-start space-x-3">
				<img class="h-8 w-auto flex-none" src="/green-play.svg" alt="pause" />
				<!-- Make a progrees bar suing progress as width -->
				<div class="flex-1">
					<div class="h-1 w-full rounded bg-progress">
						<div class="h-1 rounded bg-green" style="width: {progress}%" />
					</div>
				</div>
			</div>
			{#if currentMessage}
				{#if currentMessage.remaining > 0}
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full bg-green font-semibold text-white"
					>
						{currentMessage.remaining}
					</div>
				{/if}
				<div class="text-center text-sm text-light">{currentMessage.created_at}</div>
			{/if}
		</section>
		<SoftwareKeys>
			<div slot="left" class="flex items-center justify-start">
				{#if !loading}
					{#if playing}
						<img class="h-4 w-4" src="/pause.svg" alt="pause" />
					{:else}
						<img class="h-4 w-4" src="/speaker.svg" alt="play" />
					{/if}
				{/if}
			</div>
			<div slot="center" class="flex items-center justify-center">
				{#if !loading}
					{#if playing}
						<!-- TODO: add icons to switch between types of speaker output -->
					{:else}
						<img class="h-4 w-4" src="/mic.svg" alt="mic" />
					{/if}
				{/if}
			</div>
			<div slot="right" class="flex items-center justify-end">
				{#if !loading}
					<img class="h-4 w-4" src="/tick.svg" alt="ok" />
				{/if}
			</div>
		</SoftwareKeys>
	</main>
{/if}
<audio class="invisible" />

<svelte:window on:keydown={handleKeyDown} />
