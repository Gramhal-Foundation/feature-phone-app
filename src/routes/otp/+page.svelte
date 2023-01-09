<script lang="ts">
	import { goto } from '$app/navigation';
	import SoftwareKeys from '$lib/components/SoftwareKeys.svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { setAuthTokens } from '$lib/utils/auth';
	import axiosInstance from '$lib/utils/axios';
	import type { AuthTokens } from '$lib/utils/auth';

	let phone = '';
	let inputDisabled = false;
	let loading = false;

	const verifyOTP = async (phone: string) => {
		// TODO: Make an API call to send OTP to the phone number
		const otpPromise: Promise<string> = new Promise(async (resolve, reject) => {
			try {
				// @ts-ignore
				const activity = new MozActivity({
					name: 'get-otp',
					data: {
						pattern: /([0-9]{4,8}) OTP/g,
						timeout: 120000
					}
				});

				await axiosInstance.get(
					'https://listag.net/api/v1/utter/login?action=get_otp&mobile_number=' + phone
				);

				activity.onsuccess = function (evt: { target: { result: { code: string[] } } }) {
					resolve(evt.target.result.code[0]);
				};

				activity.onerror = function () {
					reject(this.error);
				};
			} catch (error) {
				reject(error);
			}
		});

		try {
			const otpString = await otpPromise;
			const otp = otpString.split(' ')[0];
			try {
				const response = await axiosInstance.get(
					`/login?action=submit_otp&mobile_number=${phone}&otp=${otp}`
				);
				const data = response.data as AuthTokens;
				setAuthTokens(data);
				return Promise.resolve();
			} catch (error) {
				return Promise.reject(error);
			}
		} catch (error) {
			return Promise.reject(error);
		}
	};

	const handleKeyDown = async (evt: KeyboardEvent) => {
		switch (evt.key) {
			case 'ArrowRight':
			case 'SoftRight':
				if (!loading) {
					// Check if the string is a valid phone number or not
					if (phone.length !== 10 || isNaN(Number(phone))) {
						toast.error('Please enter a valid phone number');
						return;
					}
					inputDisabled = true;
					loading = true;
					try {
						await toast.promise(verifyOTP(phone), {
							loading: 'Verifying OTP...',
							success: 'OTP verified!',
							error: 'OTP verification failed'
						});
						goto('/home');
					} catch (error) {
						console.error(error);
					}
					inputDisabled = false;
					loading = false;
				}
				return;
			default:
				return;
		}
	};
</script>

<main class="grid h-screen w-screen grid-rows-3">
	<section class="row-span-1 flex items-center justify-center bg-primary">
		<h2 class="font-semibold text-white">Enter Phone Number</h2>
	</section>
	<section class="row-span-2 bg-white p-4">
		<div class="mt-4">
			<label for="phone" class="sr-only">Phone</label>
			<input
				type="text"
				name="phone"
				id="phone"
				class="border-gray-300 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary disabled:opacity-50 sm:text-sm"
				placeholder="1234567890"
				bind:value={phone}
				disabled={inputDisabled}
			/>
		</div>
	</section>
	<SoftwareKeys>
		<div slot="right" class="flex justify-end text-white">
			{#if !loading}
				<img class="h-4 w-4" src="/tick.svg" alt="ok" />
			{/if}
		</div>
	</SoftwareKeys>
</main>

<Toaster />
<svelte:window on:keydown={handleKeyDown} />
