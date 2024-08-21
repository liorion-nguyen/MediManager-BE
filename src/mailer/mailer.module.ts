import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';
import { UserSchema } from 'src/user/entities/user.entities';
 
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
    ScheduleModule.forRoot(),
    UserModule,
  ],
  controllers: [MailerController],
  providers: [MailerService]
})
export class MailerModule { }