<script lang="ts">
	import { goto } from '$app/navigation';
	import SoftwareKeys from '$lib/components/SoftwareKeys.svelte';
	import axiosInstance from '$lib/utils/axios';
	import { setGender } from '$lib/utils/auth';

	let pageLoading = false;
	let loading = false;
	let selectedGender = 'M';

	const changeGender = () => {
		selectedGender = selectedGender === 'M' ? 'F' : 'M';
	};

	const setSelectedGender = async () => {
		try {
			await axiosInstance.post('user/update', { gender: selectedGender });
			setGender(selectedGender);
			goto('/home');
		} catch (error) {
			console.error('There was an error while trying to update user');
		}
	};

	const handleKeyDown = async (evt: KeyboardEvent) => {
		// Prevent default behaviour of the keys when the page is loading
		if (pageLoading || loading) return;
		switch (evt.key) {
			case 'ArrowRight':
			case 'SoftRight':
				// change gender
				changeGender();
				return;
			case 'ArrowLeft':
			case 'SoftLeft':
				// change gender
				changeGender();
				return;
			case 'Enter':
				// TODO: make an api call to save gender
				await setSelectedGender();
			default:
				return;
		}
	};
</script>

{#if !pageLoading}
	<main class="grid h-screen w-screen grid-rows-4">
		<section class="row-span-1 flex items-center justify-center bg-primary">
			<h2 class="font-semibold text-white">What is your gender?</h2>
		</section>
		<section class="row-span-3 flex items-center justify-between bg-white p-4">
			<div
				class="flex h-24 w-24 flex-col items-center justify-center space-y-2 rounded-sm border-2"
				class:border-primary={selectedGender === 'M'}
				class:border-gray={selectedGender !== 'M'}
			>
				<p>Man</p>
				<img src="/man.svg" alt="man" class="h-12 w-12" />
			</div>
			<div
				class="flex h-24 w-24 flex-col items-center justify-center space-y-2 rounded-sm border-2"
				class:border-primary={selectedGender === 'F'}
				class:border-gray={selectedGender !== 'F'}
			>
				<p>Woman</p>
				<img src="/woman.svg" alt="woman" class="h-12 w-12" />
			</div>
		</section>
		<SoftwareKeys>
			<div slot="center" class="flex justify-center text-white">
				<img class="h-4 w-4" src="/tick.svg" alt="ok" />
			</div>
		</SoftwareKeys>
	</main>
{/if}

<svelte:window on:keydown={handleKeyDown} />
