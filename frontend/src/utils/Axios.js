import axios from "axios";

export const setAxiosAuthToken = token => {
  if (typeof token !== "undefined" && token) {
    // Apply for every request
	localStorage.setItem('access_token', token.access);
	localStorage.setItem('refresh_token', token.refresh);
	axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');
  } 
  else {
    // Delete auth header
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};


let baseURL;

if (window.location.origin === "http://localhost:3000" || window.location.origin === "http://localhost" || window.location.origin === "http://0.0.0.0" ) {  
  // axios.defaults.baseURL = "http://127.0.0.1:8000";  
  baseURL = process.env.REACT_APP_AXIOS_DEVELOPMENT_BASEURL;   // django/backend server
} else {
  // axios.defaults.baseURL = window.location.origin;   // use the same origin.
  // So, if front and back not on the same host, pass the backend host in .env file.
  baseURL = process.env.REACT_APP_AXIOS_PRODUCTION_BASEURL;
}

axios.defaults.baseURL = baseURL;


const axiosInstance = axios.create({
	baseURL: baseURL,
	timeout: 5000,
	headers: {
		Authorization: localStorage.getItem('access_token')
			? 'Bearer ' + localStorage.getItem('access_token')
			: null,
		'Content-Type': 'application/json',
		accept: 'application/json',
		'x-api-key': 'AIzaSyC8vjRdwnVO9I3Qo8VmY90SXUvcN_CJ9-0'
	}, 
});

axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async function (error) {
		const originalRequest = error.config;

		if (typeof error.response === 'undefined') {
			alert(
				'A server/network error occurred. ' +
					'Looks like CORS might be the problem. ' +
					'Sorry about this - we will get it fixed shortly.'
			);
			return Promise.reject(error);
		}

		if (
			error.response.status === 401 &&
			originalRequest.url === baseURL + '/api/token/refresh'
		) {
			window.location.href = '/login/';
			return Promise.reject(error);
		}

		if (
			error.response.data.code === 'token_not_valid' &&
			error.response.status === 401 &&
			error.response.statusText === 'Unauthorized'
		) {
			const refreshToken = localStorage.getItem('refresh_token');

			if (refreshToken) {
				const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

				// exp date in token is expressed in seconds, while now() returns milliseconds:
				const now = Math.ceil(Date.now() / 1000);
				console.log(tokenParts.exp);

				if (tokenParts.exp > now) {
					return axiosInstance
						.post('/api/token/refresh', { refresh: refreshToken })
						.then((response) => {
							localStorage.setItem('access_token', response.data.access);
							localStorage.setItem('refresh_token', response.data.refresh);

							axiosInstance.defaults.headers['Authorization'] =
								'Bearer ' + response.data.access;
							originalRequest.headers['Authorization'] =
								'Bearer ' + response.data.access;

							return axiosInstance(originalRequest);
						})
						.catch((err) => {
							console.log(err);
						});
				} else {
					console.log('Refresh token is expired', tokenParts.exp, now);
					window.location.href = '/login/';
				}
			} else {
				console.log('Refresh token not available.');
				window.location.href = '/login/';
			}
		}

		// specific error handling done elsewhere
		return Promise.reject(error);
	}
);

export default axiosInstance;