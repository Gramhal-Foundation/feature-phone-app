import { redirect } from '@sveltejs/kit';
import { getAuthTokens } from '$lib/utils/auth';

/** @type {import('./$types').PageLoad} */
export function load() {
	if (getAuthTokens()) {
		throw redirect(307, '/home');
	}
	return {};
}
