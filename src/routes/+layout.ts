import { redirect } from '@sveltejs/kit';

export const ssr = false;

/** @type {import('./$types').LayoutLoad} */
export function load({ route }: { route: { id: string | null } }) {
	if (['/otp', '/terms'].includes(route.id ?? '')) {
		return {};
	} else {
		const termsAccepted = localStorage.getItem('termsAccepted');
		const authTokens = localStorage.getItem('authTokens');
		if (termsAccepted && authTokens) {
			return {};
		} else if (termsAccepted) {
			throw redirect(307, '/otp');
		} else {
			throw redirect(307, '/terms');
		}
	}
}
