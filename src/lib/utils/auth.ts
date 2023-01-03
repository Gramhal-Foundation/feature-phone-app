interface AuthTokens {
	access_token: string;
	refresh_token: string;
}

const getAccessToken = (): string | null => {
	const authTokens = localStorage.getItem('authTokens');
	if (authTokens) {
		const { access_token } = JSON.parse(authTokens) as AuthTokens;
		return access_token;
	}
	return null;
};
const getRefreshToken = (): string | null => {
	const authTokens = localStorage.getItem('authTokens');
	if (authTokens) {
		const { refresh_token } = JSON.parse(authTokens) as AuthTokens;
		return refresh_token;
	}
	return null;
};

const setAuthTokens = (authToken: AuthTokens) => {
	localStorage.setItem('authTokens', JSON.stringify(authToken));
};

const getAuthTokens = (): AuthTokens | null => {
	const authTokens = localStorage.getItem('authTokens');
	if (authTokens) {
		return JSON.parse(authTokens) as AuthTokens;
	}
	return null;
};

const clearAuthTokens = () => {
	localStorage.removeItem('authTokens');
};

export { getAccessToken, getRefreshToken, setAuthTokens, getAuthTokens, clearAuthTokens };
export type { AuthTokens };
