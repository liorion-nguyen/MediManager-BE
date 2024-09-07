import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly useService: UserService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const cookie = request.cookies['accessToken'];
        if (!cookie) {
            throw new ForbiddenException('Access token not found');
        }
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
        if  (requiredRoles.length == 0) {
            return true;
        }
        const payload = this.jwtService.verify(cookie);
        const user = await this.useService.getUserById(payload.sub);
        return requiredRoles.includes(user.role);
    }
}
