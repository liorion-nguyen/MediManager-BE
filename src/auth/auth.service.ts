import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);

    if (!user) {
      return {
        status: 401,
        description: 'Invalid username or password'
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        status: 401,
        description: 'Invalid username or password'
      }
    }
    const { password: userPassword, ...userData } = user._doc;

    return userData;
  }

  async generateTokens(user: any) {
    const payload = { username: user.username, sub: user._id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '60s' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.userService.setCurrentRefreshToken(refreshToken, user._id);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userService.getUserById(payload.sub);

      if (!user || user.refreshToken !== refreshToken) {
        return {
          status: 401,
          description: 'Invalid refresh token'
        };
      }
      const accessToken = this.jwtService.sign({ username: user.username, sub: user._id }, { expiresIn: '60s' });

      return {
        status: 201,
        data: accessToken
      };
    } catch (e) {
      return {
        status: 401,
        description: 'Invalid refresh token'
      };
    }
  }
}
