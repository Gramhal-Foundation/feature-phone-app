// Implement refresh token flow using axios interceptors and also use the same to add tokens to the request headers
import axios, { AxiosHeaders } from 'axios';
import { getAccessToken, getRefreshToken, setAuthTokens, clearAuthTokens } from './auth';

const axiosInstance = axios.create({
	baseURL: 'https://listag.net/api/v1/utter',
	headers: {
		'Content-Type': 'application/json'
	}
});

axiosInstance.interceptors.request.use(async (config) => {
	const accessToken = getAccessToken();
	if (accessToken) {
		config.headers = { ...config.headers } as AxiosHeaders;
		config.headers.set('Authorization', `Bearer ${accessToken}`);
	}
	return config;
});

axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			const refreshToken = getRefreshToken();
			if (refreshToken) {
				try {
					const response = await axiosInstance.post(
						'/refresh',
						{},
						{
							headers: {
								Authorization: `Bearer ${refreshToken}`
							}
						}
					);
					setAuthTokens(response.data);
					axiosInstance.defaults.headers.common[
						'Authorization'
					] = `Bearer ${response.data.access_token}`;
					setAuthTokens({
						access_token: response.data.access_token,
						refresh_token: refreshToken
					});
					return axiosInstance(originalRequest);
				} catch (error) {
					console.log(error);
					clearAuthTokens();
				}
			}
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;