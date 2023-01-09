<nav class="sticky bottom-0 h-7 w-full bg-gray py-1 px-2 text-sm text-white">
	<ul class="grid h-full grid-cols-3 items-center">
		<li>
			<slot name="left" />
		</li>
		<li>
			<slot name="center" />
		</li>
		<li>
			<slot name="right" />
		</li>
	</ul>
</nav>
