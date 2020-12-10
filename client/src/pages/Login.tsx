import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { setAccessToken } from '../accessToken';
import { useLoginMutation } from '../generated/graphql';

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [login] = useLoginMutation();
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				const response = await login({
					variables: {
						email,
						password,
					},
				});
				console.log(response);
				if (response && response.data) {
					setAccessToken(response.data.login.accessToken);
				}
				history.push('/');
			}}
		>
			<input
				type="email"
				value={email}
				required
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				type="password"
				value={password}
				required
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button type="submit">Submit</button>
		</form>
	);
};
