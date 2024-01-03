import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthPayload } from './payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GameAuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private config: ConfigService,
		) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		const token = this.extractTokenFromHeader(request);
		request['user'] = await this.validateToken(token);

		if (!request['user']) {
			throw new UnauthorizedException('Invalid token');
		}

		return true;
	}

	async validateToken(token: string): Promise<AuthPayload> {
		if (!token) {
			return undefined;
		}
		try {
			const payload = await this.jwtService.verifyAsync(
				token, { secret: this.config.get('T_SECRET') }
			);
			return payload;
		} catch {
			return undefined;
		}
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
