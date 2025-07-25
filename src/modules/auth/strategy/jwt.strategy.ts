import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // Passport will call this method with the JWT payload
  async validate(payload: any) {
    // Validate user from the token payload
    const user = await this.authService.validateUserFromToken(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
