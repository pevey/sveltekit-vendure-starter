<script lang="ts">
	import SocialLinks from '$lib/components/SocialLinks.svelte'
	let year = new Date().getFullYear()
</script>
<footer>
	<div class="mx-auto max-w-7xl overflow-hidden py-10 px-6">
		<nav class="sm:flex flex-wrap justify-center gap-x-12" aria-label="Footer">
			<div class="flex justify-center">
				<a href="/about" class="pb-2">About</a>
			</div>   
			<!-- <div class="flex justify-center">
				<a href="/location" class="pb-2 hover:text-gray-900">Location</a>
			</div>    -->
			<!-- <div class="flex justify-center">
				<a href="/blog" class="pb-2 hover:text-gray-900">Blog</a>
			</div>    -->
			<div class="flex justify-center">
				<a href="/account" class="pb-2">Account</a>
			</div>   
			<div class="flex justify-center">
				<a href="/privacy" class="pb-2">Privacy</a>
			</div>   
			<div class="flex justify-center">
				<a href="/terms" class="pb-2">Terms</a>
			</div>
		</nav>
		<div class="mt-8 flex justify-center space-x-10">
			<SocialLinks />
		</div>
		<p class="mt-8 text-center text-sm leading-5 text-gray-500">&copy; 2006 - {year} Louisiana Roasting Company, LLC. All rights reserved.</p>
	</div>
</footer>