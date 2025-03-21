import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entities';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';
import { PermissionModule } from './permission/permission.module';
import { PusherModule } from './pusher/pusher.module';
import { PusherService } from './pusher/pusher.service';
import { ServiceModule } from './service/service.module';
import { AuthModule } from './auth/auth.module';
import { MessageModule } from './message/message.module';
import { BoxChatModule } from './box-chat/box-chat.module';
import { FirebaseModule } from './firebase/firebase.module';
import { VerificationCodeModule } from './verificationCode/verification.module';
import { JwtAuthGuard } from './guards/auth.guard';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    UserModule,
    PermissionModule,
    MailerModule,
    PusherModule,
    ServiceModule,
    AuthModule,
    MessageModule,
    BoxChatModule,
    FirebaseModule,
    VerificationCodeModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1m' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PusherService],
})
export class AppModule { }
