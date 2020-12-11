import React from 'react';
import { useHelloQuery } from '../generated/graphql';

interface HelloProps {}

export const Hello: React.FC<HelloProps> = () => {
	const { data, loading, error } = useHelloQuery({
		fetchPolicy: 'network-only',
	});
	if (loading) {
		return <h1>loading</h1>;
	}
	if (error) {
		return <h1>{error.message}</h1>;
	}
	if (!data) {
		return <h1>No data</h1>;
	}
	return <h1>{data.hello}</h1>;
};
