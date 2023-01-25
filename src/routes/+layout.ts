import { redirect } from '@sveltejs/kit';
import { getAuthTokens, getGender } from '$lib/utils/auth';
import type { LayoutLoadEvent } from './$types';

export const ssr = false;

/** @type {import('./$types').LayoutLoad} */
export async function load({ url }: LayoutLoadEvent) {
	const pathname = url.pathname ?? '';
	const termsAccepted = localStorage.getItem('termsAccepted');

	if (pathname !== '/terms' && !termsAccepted) {
		throw redirect(307, '/terms');
	}
	if (pathname === '/terms' && termsAccepted) {
		throw redirect(307, '/otp');
	}

	if (pathname !== '/otp' && !getAuthTokens()) {
		throw redirect(307, '/otp');
	}
	if (pathname === '/otp' && getAuthTokens()) {
		throw redirect(307, '/home');
	}

	if (pathname !== '/gender' && !(await getGender())) {
		throw redirect(307, '/gender');
	}
	if (pathname === '/gender' && (await getGender())) {
		throw redirect(307, '/home');
	}

	if (pathname === '/') {
		throw redirect(307, '/home');
	}

	return {};
}
