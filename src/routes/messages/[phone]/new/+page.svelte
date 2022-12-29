<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import SoftwareKeys from '$lib/components/SoftwareKeys.svelte';
	import { goto } from '$app/navigation';

	let recording = false;
	let time = 60;
	let loading = false;
	let mediaRecorder: MediaRecorder | undefined;
	let cancelled = false;

	onMount(() => {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			loading = true;
			navigator.mediaDevices
				.getUserMedia(
					// constraints - only audio needed for this app
					{
						audio: true
					}
				)
				// Success callback
				.then((stream) => {
					mediaRecorder = new MediaRecorder(stream);
				})
				.finally(() => {
					loading = false;
				});
		}
	});

	const handleKeyDown = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'Enter':
				if (mediaRecorder) {
					recording = !recording;
					if (recording) {
						const audioChunks: BlobPart[] | undefined = [];

						mediaRecorder.addEventListener('dataavailable', (event) => {
							audioChunks.push(event.data);
						});

						mediaRecorder.addEventListener('stop', () => {
							time = 60;
							clearInterval(interval);
							recording = false;
							if (cancelled) return;
							const audioBlob = new Blob(audioChunks);
							const id = crypto.randomUUID();
							let db: IDBDatabase;
							const request = indexedDB.open('uttrr', 1);
							request.onerror = (event) => {
								console.error("Why didn't you allow my web app to use IndexedDB?!");
							};
							request.onsuccess = (event: any) => {
								db = event.target.result;
								// Save the audio blob to IndexedDB
								const transaction = db.transaction(['messages'], 'readwrite');
								const messagesObjectStore = transaction.objectStore('messages');
								messagesObjectStore.clear();
								const request = messagesObjectStore.add({
									id,
									phone: $page.params.phone,
									audio: audioBlob
								});
								request.onsuccess = () => {
									console.log('Audio saved to IndexedDB');
									goto(`/messages/${$page.params.phone}/view/local/${id}`);
								};
							};
							request.onupgradeneeded = (event: any) => {
								db = event.target.result;
								let objectStore = db.createObjectStore('messages', { keyPath: 'id' });
								objectStore.createIndex('phone', 'phone', { unique: false });
								objectStore.createIndex('audio', 'audio', { unique: false });
								objectStore.transaction.oncomplete = (event) => {
									// Save the audio blob to IndexedDB
									const messagesObjectStore = db
										.transaction('messages', 'readwrite')
										.objectStore('messages');
									messagesObjectStore.clear();
									const request = messagesObjectStore.add({
										id,
										phone: $page.params.phone,
										audio: audioBlob
									});

									request.onsuccess = () => {
										console.log('Audio saved to IndexedDB');
										goto(`/messages/${$page.params.phone}/view/local/${id}`);
									};
								};
							};
						});

						mediaRecorder.start();

						const interval = setInterval(() => {
							time--;
							if (time === 0) {
								mediaRecorder?.stop();
								clearInterval(interval);
								recording = false;
								time = 60;
							}
						}, 1000);
					} else {
						mediaRecorder.stop();
					}
				}
				return;
			case 'ArrowLeft':
			case 'SoftLeft':
				cancelled = true;
				mediaRecorder?.stop();
				goto(`/home`);
				return;
			default:
				return;
		}
	};
</script>

{#if !loading}
	<main class="flex h-screen flex-col bg-primary pb-7">
		<section class="flex flex-col items-center space-y-4 py-4 px-4">
			<div class="flex flex-col items-center">
				<img src="/uttrr.svg" alt="logo" class="h-16 w-16" />
				<h1 class="text-center text-lg font-semibold text-white">{$page.params.phone}</h1>
			</div>
			{#if recording}
				<img src="/mic.svg" alt="mic" class="h-12 w-12 animate-pulse" />
				<span class="text-center text-white">{time}</span>
			{/if}
		</section>
		<SoftwareKeys>
			<div slot="left" class="flex items-center justify-start">
				{#if recording}
					<img class="h-4 w-4" src="/cancel.svg" alt="back" />
				{/if}
			</div>
			<div slot="center" class="flex items-center justify-center">
				{#if recording}
					<img class="h-4 w-4" src="/tick.svg" alt="finish" />
				{:else}
					<img class="h-4 w-4" src="/mic.svg" alt="record" />
				{/if}
			</div>
		</SoftwareKeys>
	</main>
{/if}

<svelte:window on:keydown={handleKeyDown} />
