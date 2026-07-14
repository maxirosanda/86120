import { Injectable } from "@nestjs/common";
import { Strategy } from "passport-jwt";
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService , 
        private usersService: UsersService,
    ) {
        super({
            jwtFromRequest: (req) => {
                if (!req || !req.headers) {
                    return null;
                }
                return req.cookies?.access_token || null;
            },
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET') || 'defaultSecret',
        });
    }
    async validate(payload: {email: string, sub: string}) {
        const user = await this.usersService.findByEmail(payload.email);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}