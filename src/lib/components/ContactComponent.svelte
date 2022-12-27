<script lang="ts">
	export let src: string;
	export let phone: string;
	export let datetime: string;
	export let count: number | undefined;
</script>

<section class="flex items-center space-x-2 focus:bg-primary focus:text-white">
	<aside class="rounded bg-white">
		<img {src} alt="icon" class="h-[60px] w-[60px] object-contain" />
	</aside>
	<div class="flex flex-col justify-center">
		<!-- svelte-ignore a11y-distracting-elements -->
		<h3 class="truncate font-semibold">{phone}</h3>
		<p class="truncate text-sm">{datetime}</p>
	</div>
	<aside class="flex items-center justify-end pr-2">
		{#if count}
			<span
				class="h-5 w-5 rounded-full bg-primary text-center text-sm font-semibold text-white group-focus:bg-white group-focus:text-primary"
				>{count}</span
			>
		{/if}
	</aside>
</section>
