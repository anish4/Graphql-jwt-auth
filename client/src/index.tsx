import React from 'react';
import ReactDOM from 'react-dom';
import {
	ApolloClient,
	createHttpLink,
	ApolloProvider,
	InMemoryCache,
	ApolloLink,
	from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';

import { App } from './App';
import reportWebVitals from './reportWebVitals';
import { getAccessToken, setAccessToken } from './accessToken';
import { TokenRefreshLink } from 'apollo-link-token-refresh';

import jwtDecode from 'jwt-decode';

const httpLink = createHttpLink({
	uri: 'http://localhost:5000/graphql',
	credentials: 'include',
});

const authMiddleware = new ApolloLink((operation, forward) => {
	// add the authorization to the headers
	operation.setContext(({ headers = {} }) => {
		const token = getAccessToken();
		return {
			headers: {
				...headers,
				authorization: token ? `Bearer ${token}` : '',
			},
		};
	});

	return forward(operation);
});
// const authMiddleware = new ApolloLink(
// 	(operation, forward) =>
// 		new Observable((observer) => {
// 			let handle: any;
// 			Promise.resolve(operation)
// 				.then((operation) => {
// 					const accessToken = getAccessToken();
// 					if (accessToken) {
// 						operation.setContext({
// 							headers: {
// 								authorization: `bearer ${accessToken}`,
// 							},
// 						});
// 					}
// 				})
// 				.then(() => {
// 					handle = forward(operation).subscribe({
// 						next: observer.next.bind(observer),
// 						error: observer.error.bind(observer),
// 						complete: observer.complete.bind(observer),
// 					});
// 				})
// 				.catch(observer.error.bind(observer));

// 			return () => {
// 				if (handle) handle.unsubscribe();
// 			};
// 		})
// );

const client = new ApolloClient({
	link: from([
		new TokenRefreshLink({
			accessTokenField: 'accessToken',
			isTokenValidOrUndefined: () => {
				const token = getAccessToken();
				if (!token) {
					return true;
				}
				try {
					const { exp }: any = jwtDecode(token);
					if (Date.now() >= exp * 1000) {
						return false;
					}
					return true;
				} catch (e) {
					return false;
				}
			},
			fetchAccessToken: () =>
				fetch('http://localhost:5000/refresh_token', {
					method: 'POST',
					credentials: 'include',
				}),
			handleFetch: (accessToken) => {
				setAccessToken(accessToken);
			},
			handleError: (err) => {
				console.warn('Invalid refresh token !!!Try again');
				console.error(err);
			},
		}),
		onError(({ graphQLErrors, networkError }) => {
			if (graphQLErrors)
				graphQLErrors.map(({ message, locations, path }) =>
					console.log(
						`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
					)
				);

			if (networkError) console.log(`[Network error]: ${networkError}`);
		}),
		authMiddleware,
		httpLink,
	]),
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
