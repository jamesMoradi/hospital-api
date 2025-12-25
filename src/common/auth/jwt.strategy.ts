import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '@modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userervices: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: <string>process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const { email } = payload;
    console.log(payload);
    const user = await this.userervices.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Login first to access this endpoint');
    }

    const { data } = user;

    return {
      userId: data?._id,
      email: data?.email,
      role: data?.role,
    };
  }
}
