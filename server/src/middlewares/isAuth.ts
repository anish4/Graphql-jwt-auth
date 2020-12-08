import { verify } from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';
import { ContextType } from '../types/ContextType';

export const isAuth: MiddlewareFn<ContextType> = ({ context }, next) => {
	const auth = context.req.headers['authorization'];
	if (!auth) {
		throw new Error('not authorized');
	}

	try {
		const token = auth.split(' ')[1];
		const payload = verify(token, process.env.ACCESS_TOEKN_SECRET!);
		context.payload = payload as any;
	} catch (e) {
		console.log(e);
		throw new Error('not authorized');
	}
	return next();
};
