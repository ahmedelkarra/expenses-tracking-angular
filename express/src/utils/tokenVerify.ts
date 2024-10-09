import { GraphQLError, GraphQLErrorOptions } from 'graphql';
import jwt from 'jsonwebtoken';

export interface IPayload extends jwt.JwtPayload {
    id: string;
    iat: number;
    exp: number;
}

const tokenVerify = (token: string): string | IPayload => {
    const secret = process.env.SECRET_JWT as string;

    try {
        const payload = jwt.verify(token, secret) as IPayload;
        return payload;
    } catch (error) {
        throw new GraphQLError('Invalid or expired token', { extensions: { code: 'Invalid or expired token', http: 401 } })
    }
};

export default tokenVerify;
