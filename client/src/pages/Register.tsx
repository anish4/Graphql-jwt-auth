import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useRegisterMutation } from '../generated/graphql';

export const Register: React.FC<RouteComponentProps> = ({ history }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [register] = useRegisterMutation();
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				await register({
					variables: {
						email,
						password,
					},
				});
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
