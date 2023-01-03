import { redirect } from '@sveltejs/kit';
import { getAuthTokens } from '$lib/utils/auth';

/** @type {import('./$types').PageLoad} */
export function load() {
	if (localStorage.getItem('termsAccepted') && getAuthTokens()) {
		throw redirect(307, '/home');
	} else if (localStorage.getItem('termsAccepted')) {
		throw redirect(307, '/otp');
	}
	return {};
}
