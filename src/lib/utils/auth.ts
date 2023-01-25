import axiosInstance from './axios';

interface AuthTokens {
	access_token: string;
	refresh_token: string;
}

interface User {
	_id: string;
	created_at: number;
	gender: string;
	mobile_number: string;
	name: string;
}

interface UserResponse {
	user: User;
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

const getGender = async (): Promise<string | null> => {
	const gender = localStorage.getItem('gender');
	if (!gender) {
		try {
			const response = await axiosInstance.get<UserResponse>('/get_current_user');
			const { user } = response.data;
			if (user.gender === 'M' || user.gender === 'F') {
				setGender(user.gender);
				return user.gender;
			} else {
				return null;
			}
		} catch (error) {
			console.error(error);
			return null;
		}
	} else {
		if (gender === 'M' || gender === 'F') {
			return gender;
		} else {
			return null;
		}
	}
};

const setGender = (gender: string): void => {
	return localStorage.setItem('gender', gender);
};

export {
	getAccessToken,
	getRefreshToken,
	setAuthTokens,
	getAuthTokens,
	clearAuthTokens,
	getGender,
	setGender
};

export type { AuthTokens };
