<script lang="ts">
	import SoftwareKeys from '$lib/components/SoftwareKeys.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import axiosInstance from '$lib/utils/axios';
	import { getLocale } from '$lib/utils';

	interface Translations {
		agree: string;
		readMore: string;
		selectAgree: string;
		welcome: string;
	}

	let translations: Translations | null = null;
	let pageLoading: boolean = true;

	onMount(() => {
		// Fetch translations from server
		const lang = getLocale();
		pageLoading = true;
		axiosInstance
			.get(`translations/${lang}/terms`)
			.then((res) => {
				translations = res.data;
			})
			.catch((err) => {
				console.error('There was an error while fetching language data: ', err);
			})
			.finally(() => {
				pageLoading = false;
			});
	});

	const handleKeyDown = (evt: KeyboardEvent) => {
		// Ignore events when page is loading
		if (pageLoading) return;
		switch (evt.key) {
			case 'SoftLeft':
				// TODO: Open terms in browser
				return;
			case 'Enter':
				return;
			case 'ArrowRight':
			case 'SoftRight':
				localStorage.setItem('termsAccepted', 'true');
				return goto('/otp');
			default:
				return;
		}
	};
</script>

{#if !pageLoading}
	<main class="grid h-screen w-screen grid-rows-2">
		<section class="flex h-full w-full items-center justify-center bg-white">
			<img class="h-20 w-20" src="/uttrr_with_name.svg" alt="uttrr" />
		</section>
		<section class="flex h-full w-full justify-center bg-primary text-center text-white">
			<div class="m-4 space-y-2">
				<h2 class="text-base font-bold">{translations?.welcome ?? 'Welcome'}</h2>
				<p class="text-sm">
					{translations?.selectAgree ??
						'Select “Agree” to accept the Terms of Service and continue'}
				</p>
			</div>
		</section>
		<SoftwareKeys>
			<p class="truncate text-left" slot="left">{translations?.readMore ?? 'Read more'}</p>
			<p class="truncate text-right" slot="right">{translations?.agree ?? 'Agree'}</p>
		</SoftwareKeys>
	</main>
{/if}
<svelte:window on:keydown={handleKeyDown} />
