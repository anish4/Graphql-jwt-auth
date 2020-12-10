import React, { useEffect, useState } from 'react';
import { setAccessToken } from './accessToken';
import Routes from './Routes';
interface AppProps {}

export const App: React.FC<AppProps> = () => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch('http://localhost:5000/refresh_token', {
			method: 'POST',
			credentials: 'include',
		})
			.then((data) => data.json())
			.then((data) => {
				const { accessToken } = data;
				setAccessToken(accessToken);
				setLoading(false);
			});
	}, []);

	if (loading) {
		return <h4>Loading....</h4>;
	}

	return <Routes />;
};
