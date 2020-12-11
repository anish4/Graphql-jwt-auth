import { Response } from 'express';

export const sendRefeshToken = (res: Response, token: string): void => {
	res.cookie('uid', token, {
		httpOnly: true,
		path: '/refresh_token',
		expires: new Date(Date.now() + 15 * 24 * 3600 * 1000),
	});
};
