<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	import SoftwareKeys from '$lib/components/SoftwareKeys.svelte';
	import { goto } from '$app/navigation';
	import axiosInstance from '$lib/utils/axios';
	import { getLocale } from '$lib/utils';

	interface Translations {
		sending: string;
		sent: string;
		sendError: string;
	}

	let player: HTMLAudioElement | null = null;
	let playing = false;
	let audioBlob: Blob | null = null;
	let time = '0:0 / 0:0';
	let pageLoading: boolean = true;
	let translations: Translations | null = null;

	onMount(() => {
		const lang = getLocale();
		pageLoading = true;
		axiosInstance
			.get(`translations/${lang}/preview`)
			.then((res) => {
				translations = res.data;
			})
			.catch((err) => {
				console.error('There was an error while fetching language data: ', err);
			})
			.finally(async () => {
				pageLoading = false;
			});
		// Get the audio blob from messages collection in uttrr db in indexdb
		let db: IDBDatabase;
		const request = indexedDB.open('uttrr', 1);
		request.onerror = (event) => {
			console.error("Why didn't you allow my web app to use IndexedDB?!");
		};

		request.onsuccess = (event: any) => {
			db = event.target.result;
			const transaction = db.transaction(['messages'], 'readonly');
			const objectStore = transaction.objectStore('messages');
			const request = objectStore.get($page.params.localMessageId);
			request.onerror = (event) => {
				console.error('Error getting audio blob from IndexedDB');
			};
			request.onsuccess = (event: any) => {
				audioBlob = event.target.result.audio;
				if (!audioBlob) return;
				const audioUrl = URL.createObjectURL(audioBlob);
				player = document.querySelector('audio');
				if (!player) {
					return;
				} else {
					player.src = audioUrl;
					player.onpause = () => {
						playing = false;
					};
					player.onplay = () => {
						playing = true;
					};
					player.onloadedmetadata = () => {
						const duration = player?.duration || 0;
						const minutes = Math.floor(duration / 60);
						const seconds = Math.floor(duration % 60);
						time = `0:0 / ${minutes}:${seconds}`;
					};
					player.ontimeupdate = () => {
						const currentTime = player?.currentTime || 0;
						const minutes = Math.floor(currentTime / 60);
						const seconds = Math.floor(currentTime % 60);
						time = `${minutes}:${seconds} / ${time.split('/')[1]}`;
					};
				}
			};
		};

		return () => {
			if (player) {
				player.pause();
				player = null;
			}
		};
	});

	const sendRecording = async () => {
		if (!audioBlob) {
			return;
		} else {
			const formData = new FormData();
			const blob = new Blob([audioBlob], {
				type: 'audio/mp3'
			});
			formData.append('file', blob);
			try {
				const response = await axiosInstance.post(
					`/send_message?to_user_mobile_number=${$page.params.phone}`,
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data'
						}
					}
				);
				goto('/home');
			} catch (error) {
				toast.error(translations?.sendError ?? 'Error sending message');
			}
		}
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		// Prevent actions when page is loading
		if (pageLoading) return;
		switch (event.key) {
			case 'ArrowLeft':
			case 'SoftLeft':
				// Back
				if (player && playing) {
					player.pause();
					player.currentTime = 0;
				}
				goto(`/messages/${$page.params.phone}/new`);
				break;
			case 'Enter':
				// Play/Pause
				if (player) {
					if (playing) {
						player.pause();
					} else {
						player.play();
					}
				}
				break;
			case 'ArrowRight':
			case 'SoftRight':
				// Send
				if (player && playing) {
					player.pause();
					player.currentTime = 0;
				}
				toast.promise(sendRecording(), {
					loading: translations?.sending ?? 'Sending...',
					success: translations?.sent ?? 'Sent!',
					error: translations?.sendError ?? 'Error sending message'
				});
				break;
		}
	};
</script>

{#if !pageLoading}
	<main class="flex h-screen flex-col bg-primary">
		<section class="flex flex-grow flex-col items-center space-y-4 py-4 px-4">
			<div class="flex flex-col items-center">
				<img src="/uttrr.svg" alt="logo" class="h-16 w-16" />
				<h1 class="text-center text-lg font-semibold text-white">{$page.params.phone}</h1>
			</div>

			<img src="/speaker.svg" alt="speaker" class="h-12 w-12" class:animate-pulse={playing} />

			<span class="text-white">{time}</span>
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
{/if}

<audio class="invisible" />

<svelte:window on:keydown={handleKeyDown} />
