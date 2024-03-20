import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

export interface Payload {
  sub: string;
  email: string;
  role: string;
  is_active: boolean;
}

export interface ValidatedPayload {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
}
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: Payload): Promise<ValidatedPayload> {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      is_active: payload.is_active ?? false,
    };
  }
}
