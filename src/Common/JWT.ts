import jwt from 'jsonwebtoken';

import { env } from '~/env';
import { ProjectResponse } from './Class';



export class Jwt {
    private static JWT_KEY = env.NEXTAUTH_SECRET!;

    static SignJwt = (data: any, expireIn?: string | number): ProjectResponse<string> => {
        let _res = new ProjectResponse<string>();

        try {

            const getToken = jwt.sign(
                {
                    data: data,
                },
                this.JWT_KEY,
                {
                    expiresIn: expireIn || '1h',
                    //  algorithm: 'RS256'
                }
            );

            if (getToken) {
                _res.data = getToken;
            } else {
                _res.error = 'Server Error not able to generate token';
            }

        } catch (error: any) {
            _res.error = error.message;
        } finally {
            return _res;
        }
    };

    static VerifyJwt = (token: string): ProjectResponse<any> => {
        let _res = new ProjectResponse();

        try {
            const decodedToken: any = jwt.verify(token, this.JWT_KEY);
            if (decodedToken) {

                _res.data = decodedToken.data;

            } else {
                _res.error = 'Not able to Decode Token, Might bo Wrong Token/key Provided.';
            }
        } catch (error: any) {
            _res.error = error.message;
        } finally {
            return _res;
        }
    };
}
