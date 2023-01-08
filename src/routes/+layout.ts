import { redirect } from '@sveltejs/kit';
import { getAuthTokens } from '$lib/utils/auth';

export const ssr = false;

/** @type {import('./$types').LayoutLoad} */
export function load({ route }: { route: { id: string | null } }) {
	if (['/otp', '/terms'].includes(route.id ?? '')) {
		return {};
	} else {
		const termsAccepted = localStorage.getItem('termsAccepted');
		if (termsAccepted && getAuthTokens()) {
			if (route.id === '/') {
				throw redirect(307, '/home');
			}
			return {};
		} else if (termsAccepted) {
			throw redirect(307, '/otp');
		} else {
			throw redirect(307, '/terms');
		}
	}
}
