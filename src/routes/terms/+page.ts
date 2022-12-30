import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load() {
	if (localStorage.getItem('termsAccepted') && localStorage.getItem('authTokens')) {
		throw redirect(307, '/home');
	} else if (localStorage.getItem('termsAccepted')) {
		throw redirect(307, '/otp');
	}
	return {};
}
