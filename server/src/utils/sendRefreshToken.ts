import { Response } from 'express';

export const sendRefeshToken = (res: Response, token: string): void => {
	res.cookie('uid', token, { httpOnly: true, path: '/refresh_token' });
};
