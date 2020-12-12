import {
	Resolver,
	Query,
	Mutation,
	Args,
	Field,
	ArgsType,
	ObjectType,
	Ctx,
	UseMiddleware,
	Arg,
	Int,
} from 'type-graphql';
import { Length, IsEmail } from 'class-validator';

import { hash, compare } from 'bcryptjs';

import { User } from '../entity/User';
import { ContextType } from '../types/context';
import { createAccessToken, createRefreshToken } from '../utils/token';
import { isAuth } from '../middlewares/isAuth';
import { getConnection } from 'typeorm';
import { sendRefeshToken } from '../utils/sendRefreshToken';
import { verify } from 'jsonwebtoken';

@ArgsType()
class RegisterArgs {
	@Field()
	@IsEmail()
	email: string;

	@Field()
	@Length(5, 20)
	password: string;
}

@ObjectType()
class TokenResponse {
	@Field()
	accessToken: string;

	@Field(() => User)
	user: User;
}

@Resolver()
export class userResolver {
	@Query(() => [User])
	async users(): Promise<User[]> {
		return await User.find();
	}

	@Query(() => User, { nullable: true })
	async me(@Ctx() { req }: ContextType): Promise<User | null | undefined> {
		const auth = req.headers['authorization'];
		if (!auth) {
			return null;
		}

		try {
			const token = auth.split(' ')[1];
			const payload = verify(token, process.env.ACCESS_TOEKN_SECRET!) as any;
			return User.findOne({ id: payload.id });
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	@Query(() => String)
	@UseMiddleware(isAuth)
	hello(@Ctx() { payload }: ContextType): string {
		return `your userId is ${payload?.id}`;
	}

	@Mutation(() => Boolean)
	async register(@Args() { email, password }: RegisterArgs): Promise<boolean> {
		const hashedPassword = await hash(password, 10);
		try {
			await User.insert({ email, password: hashedPassword });
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}
	@Mutation(() => TokenResponse)
	async login(
		@Args() { email, password }: RegisterArgs,
		@Ctx() { res }: ContextType
	): Promise<TokenResponse> {
		const user = await User.findOne({ email });
		if (!user) {
			throw new Error('no user found');
		}

		const isValid = await compare(password, user.password);
		if (!isValid) {
			throw new Error('incorrect password');
		}

		sendRefeshToken(res, createRefreshToken(user));

		return {
			accessToken: createAccessToken(user),
			user,
		};
	}
	//don't expose to users
	@Mutation(() => Boolean)
	async revokeRefreshToken(
		@Arg('userId', () => Int) userId: number
	): Promise<boolean> {
		await getConnection()
			.getRepository(User)
			.increment({ id: userId }, 'tokenVersion', 1);
		return true;
	}
}
