import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class Reply {
  @Prop({ type: String })
  id: string;

  @Prop({ type: String })
  content: string;
}
export class Emoji {
  @Prop({ type: String })
  creator: string;

  @Prop({ type: String })
  type: string;
}
@Schema({
  timestamps: true,
})
export class Message extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ default: null })
  boxId: string;

  @Prop({ default: null })
  reply: Reply;

  @Prop({ default: null })
  emoji: Emoji[];

  @Prop({ required: true })
  content: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
