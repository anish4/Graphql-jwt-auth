import React from 'react';
import ReactDOM from 'react-dom';
import {
	ApolloClient,
	createHttpLink,
	ApolloProvider,
	InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { getAccessToken } from './accessToken';

const link = createHttpLink({
	uri: 'http://localhost:5000/graphql',
});

const authLink = setContext((_, { headers }) => {
	const token = getAccessToken();
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : '',
		},
	};
});

const client = new ApolloClient({
	link: authLink.concat(link),
	cache: new InMemoryCache(),
});

ReactDOM.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
