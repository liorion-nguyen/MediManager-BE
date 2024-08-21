import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FirebaseService {
  constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App) {}

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const bucket = this.firebaseAdmin.storage().bucket();
    const filename = `${uuidv4()}-${file.originalname}`;
    const fileUpload = bucket.file(filename);
    await fileUpload.save(file.buffer);
    await fileUpload.makePublic();

    return fileUpload.publicUrl();
  }
}
