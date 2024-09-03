import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Định nghĩa lớp ContactUser dựa trên thông tin đã cung cấp
class ContactUser {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  nickName: string;

  @Prop({ required: true })
  role: string;
}

// Định nghĩa schema cho BoxChat với các decorators
@Schema({
  timestamps: true, // Bổ sung timestamps tự động
})
export class BoxChat extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ default: '👍' })
  emotional: string;

  @Prop({ required: true })
  theme: string;

  @Prop({ type: [ContactUser], required: true })
  contactUser: ContactUser[];
}

// Tạo Schema bằng SchemaFactory
export const BoxChatSchema = SchemaFactory.createForClass(BoxChat);
