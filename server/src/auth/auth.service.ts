import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';

export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}

export interface AuthResponse {
    access_token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.usersService.findOne(email);
        if (user && (await this.usersService.validatePassword(user, password))) {
            return user;
        }
        return null;
    }

    async login(user: User): Promise<AuthResponse> {
        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }

    async register(email: string, password: string, name: string): Promise<AuthResponse> {
        const user = await this.usersService.create({
            email,
            password,
            name,
        });

        return this.login(user);
    }
}
