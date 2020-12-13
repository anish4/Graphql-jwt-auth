import React from 'react';
import { BrowserRouter as Router, Switch, Link, Route } from 'react-router-dom';
import { setAccessToken } from './accessToken';
import { useLogoutMutation, useMeQuery } from './generated/graphql';
import { Hello } from './pages/Hello';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

const Routes: React.FC = () => {
	const { data, loading } = useMeQuery({ fetchPolicy: 'network-only' });
	const [logout, { client }] = useLogoutMutation();

	let body: any = null;

	if (loading) {
		body = null;
	} else if (data && data.me) {
		body = `you are logged in as ${data.me.email}`;
	} else {
		body = 'you are not logged in';
	}

	return (
		<Router>
			<div>
				<nav>
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/login">Login</Link>
						</li>
						<li>
							<Link to="/register">Register</Link>
						</li>
						<li>
							<Link to="/hello">Hello</Link>
						</li>
						<li>{body}</li>
					</ul>
					{!loading && data && data.me ? (
						<button
							onClick={async () => {
								try {
									await logout();
									setAccessToken('');
									client.resetStore();
								} catch (e) {
									console.log(e.message);
								}
							}}
						>
							logout
						</button>
					) : null}
				</nav>

				{/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/register" component={Register} />
					<Route exact path="/hello" component={Hello} />
				</Switch>
			</div>
		</Router>
	);
};
export default Routes;
