import { Module } from '@nestjs/common';
import { BoxChatController } from './box-chat.controller';
import { BoxChatService } from './box-chat.service';
import { UserService } from 'src/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { BoxChat, BoxChatSchema } from './schema/box-chat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BoxChat.name, schema: BoxChatSchema }]),
    UserModule,
  ],
  providers: [BoxChatService],
  controllers: [BoxChatController],
  exports: [BoxChatService],
})
export class BoxChatModule {}
