<script>
	import SoftwareKeys from '$lib/components/SoftwareKeys.svelte';
</script>

<main class="grid h-screen w-screen grid-rows-2">
	<section class="flex h-full w-full items-center justify-center bg-white">
		<img class="h-20 w-20" src="\Uttrr_56.svg" alt="uttrr" />
	</section>
	<section class="flex h-full w-full justify-center bg-primary text-center text-white">
		<div class="m-4 space-y-2">
			<h2 class="text-base font-bold">Welcome</h2>
			<p class="text-sm">Select “Agree” to accept the Terms of Service and continue</p>
		</div>
	</section>
	<SoftwareKeys>
		<p class="truncate text-left" slot="left">Read more</p>
		<p class="truncate text-right" slot="right">Agree</p>
	</SoftwareKeys>
</main>
