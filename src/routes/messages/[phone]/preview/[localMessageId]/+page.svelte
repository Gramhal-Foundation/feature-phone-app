<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import SoftwareKeys from '$lib/components/SoftwareKeys.svelte';
	import { goto } from '$app/navigation';

	let player: HTMLAudioElement | null = null;
	let playing = false;
	let audioBlob: Blob | null = null;
	let time = '0:0 / 0:0';

	onMount(() => {
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
				console.log(audioBlob);
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

	const handleKeyDown = (event: KeyboardEvent) => {
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
				break;
		}
	};
</script>

<main class="flex h-screen flex-col bg-primary pb-7">
	<section class="flex flex-col items-center space-y-4 py-4 px-4">
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

<audio class="invisible" />

<svelte:window on:keydown={handleKeyDown} />