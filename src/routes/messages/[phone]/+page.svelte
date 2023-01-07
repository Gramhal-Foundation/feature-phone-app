<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import SoftwareKeys from '$lib/components/SoftwareKeys.svelte';
	import axiosInstance from '$lib/utils/axios';
	import toast, { Toaster } from 'svelte-french-toast';
	import { goto } from '$app/navigation';

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

	let playing = false;
	let player: HTMLAudioElement | null = null;
	let progress = 0;
	let currentMessage: Message | null = null;

	onMount(() => {
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

	const getNextMessage = () => {
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
	};

	const markMessageAsRead = (chatId: string) => {
		axiosInstance
			.post<MarkedAsReadResponse>(`/mark_read?chat_id=${chatId}`)
			.then((res) => {
				if (res.data) {
					toast.success(res.data.message);

					if (res.data.next_chat) {
						currentMessage = res.data.next_chat;
						if (player) {
							player.currentTime = 0;
							player.setAttribute('src', res.data.next_chat.url);
						}
					} else {
						goto('/home');
					}
				}
			})
			.catch((err) => {
				console.log(err);
				toast.error('Something went wrong');
			});
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'ArrowLeft':
			case 'SoftLeft':
				if (playing) {
					player?.pause();
				} else {
					player?.play();
				}
				return;
			case 'ArrowRight':
			case 'SoftRight':
				player?.pause();
				markMessageAsRead(currentMessage?._id ?? '');
				return;
			default:
				return;
		}
	};
</script>

<main class="grid h-screen grid-rows-5  pb-7">
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

<audio class="invisible" />

<Toaster />

<svelte:window on:keydown={handleKeyDown} />
