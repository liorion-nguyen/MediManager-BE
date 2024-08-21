import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

enum UserRole {
    PATIENT = 'Bệnh nhân',
    DOCTOR = 'Bác sĩ',
    RECEPTION = 'Lễ tân',
    ADMIN = 'Quản trị viên',
}

enum Gender {
    MALE = 'Nam',
    FEMALE = 'Nữ',
    OTHER = 'Khác',
}

@Schema({
    timestamps: true,
})
export class User extends Document {
    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, enum: UserRole })
    role: UserRole;

    @Prop({ required: true })
    fullName: string;

    @Prop()
    email?: string;

    @Prop()
    phoneNumber?: string;

    @Prop()
    dateOfBirth?: Date;

    @Prop({ enum: Gender })
    gender?: Gender;

    @Prop()
    address?: string;

    @Prop()
    cccdNumber?: string;

    @Prop({ default: true })
    isActive?: boolean;

    @Prop()
    profileImage?: string;

    @Prop()
    lastLogin?: Date;

    @Prop()
    emergencyContact?: string;

    @Prop()
    insuranceNumber?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
