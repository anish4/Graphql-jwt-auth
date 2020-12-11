import { User } from 'entity/User';
import { sign } from 'jsonwebtoken';

export const createAccessToken = (user: User): string => {
	return sign({ id: user.id }, process.env.ACCESS_TOEKN_SECRET!, {
		expiresIn: '15s',
	});
};

export const createRefreshToken = (user: User): string => {
	return sign(
		{ id: user.id, tokenVersion: user.tokenVersion },
		process.env.REFRESH_TOKEN_SECRET!,
		{
			expiresIn: '15d',
		}
	);
};
