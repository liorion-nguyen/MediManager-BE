import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true,
})
export class Service extends Document {
    @Prop({ required: true })
    name: string;

    @Prop()
    description?: string;

    @Prop()
    sampling: string;

    @Prop()
    result: string;

    @Prop()
    condition?: string;

    @Prop({ type: Number, default: 0 })
    numSampleSupport: number;

    @Prop({ type: [String], default: [] })
    room?: string[];
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
