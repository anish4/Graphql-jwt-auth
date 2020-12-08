import 'dotenv/config';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import cookieParser from 'cookie-parser';

import { userResolver } from './resolvers/userResolver';
import { verify } from 'jsonwebtoken';
import { User } from './entity/User';
import { createAccessToken, createRefreshToken } from './utils/token';
import { sendRefeshToken } from './utils/sendRefreshToken';

(async () => {
	const app = express();
	app.use(cookieParser());
	app.post('/refresh_token', async (req, res) => {
		const token = req.cookies.uid;
		if (!token) {
			return res.send({ ok: false, accessToken: '' });
		}
		let payload: any = null;
		try {
			payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
		} catch (e) {
			console.log(e);
			return res.send({ ok: false, accessToken: '' });
		}

		const user = await User.findOne({ id: payload.id });
		if (!user) {
			return res.send({ ok: false, accessToken: '' });
		}

		if (user.tokenVersion != payload.tokenVersion) {
			return res.send({ ok: false, accessToken: '' });
		}

		sendRefeshToken(res, createRefreshToken(user));

		res.send({
			ok: true,
			accessToken: createAccessToken(user),
		});
	});

	await createConnection();
	const schema = await buildSchema({ resolvers: [userResolver] });

	const apolloServer = new ApolloServer({
		schema,
		context: ({ req, res }) => ({ req, res }),
	});
	apolloServer.applyMiddleware({ app });

	app.listen(5000, () => {
		console.log('server started in port 50000');
	});
})();
