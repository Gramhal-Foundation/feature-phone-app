import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load() {
	if (localStorage.getItem('authTokens')) {
		throw redirect(307, '/home');
	}
	return {};
}
