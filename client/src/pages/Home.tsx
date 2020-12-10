import React from 'react';
import { useUsersQuery } from '../generated/graphql';

interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
	const { data, loading } = useUsersQuery({ fetchPolicy: 'network-only' });
	if (loading) {
		return <h4>loading......</h4>;
	}
	return (
		<ul>
			{data?.users.map((d) => {
				return (
					<li key={d.id}>
						{d.id} {d.email}
					</li>
				);
			})}
		</ul>
	);
};
