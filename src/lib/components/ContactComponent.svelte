<script lang="ts">
	export let src: string;
	export let phone: string;
	export let datetime: string | null;
	export let count: number | undefined;
	export let invite: boolean = false;
</script>

<section
	class="group flex items-center space-x-2 data-[nav-selected=true]:bg-primary data-[nav-selected=true]:text-white"
	data-nav-selectable="true"
	data-phone={phone}
	data-count={count}
	data-invite={invite}
>
	<aside class="m-2 rounded bg-white">
		<img {src} alt="icon" class="h-[42.6px] w-[42.6px] object-cover" />
	</aside>
	<div class="flex flex-col justify-center">
		<!-- svelte-ignore a11y-distracting-elements -->
		<h3 class="truncate font-semibold">{phone}</h3>
		{#if datetime}
			<p class="truncate text-sm">{datetime}</p>
		{/if}
	</div>
	<aside class="flex items-center justify-end pr-2">
		{#if count && count > 0 && !invite}
			<span
				class="h-5 w-5 rounded-full bg-primary text-center text-sm font-semibold text-white group-data-[nav-selected=true]:bg-white group-data-[nav-selected=true]:text-primary"
				>{count}</span
			>
		{/if}
		{#if invite}
			<img src="/invite.svg" alt="invite" class="h-5 w-5" />
		{/if}
	</aside>
</section>
