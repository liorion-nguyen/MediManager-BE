import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as file from "./firebase-adminsdk.json"

@Injectable()
export class FirebaseService {
  
  private static isInitialized = false; // Static variable to track initialization status
  private readonly storage: admin.storage.Storage;

  constructor() {
    // Ensure that Firebase is initialized only once
    if (!FirebaseService.isInitialized) {
      const serviceAccount = require('./firebase-adminsdk.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'medimanager-liorion.appspot.com',
      });
      FirebaseService.isInitialized = true; // Mark Firebase as initialized
    }

    this.storage = admin.storage();
  }

  getStorage(): admin.storage.Storage {
    return this.storage;
  }

  async UploadImage(file: Express.Multer.File):Promise<string> {
    const storage = await this.getStorage();
    const bucket = storage.bucket();
    const filename = `${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(filename);
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        reject(error);
      });
      stream.on('finish', () => {
        fileUpload.getSignedUrl({
            action: 'read',
            expires: '03-09-2491', 
          }, (err, signedUrl) => {
            if (err) {
              reject(err);
            } else {
              resolve(signedUrl);
            }
          });
      });
      stream.end(file.buffer);
    });
  } 

  async DeleteImage(imageUrl: string): Promise<void> {
    const storage = await this.getStorage();
    const bucket = storage.bucket();
  
    const decodeName = decodeURIComponent(imageUrl);
    const fileName = decodeName.split('/')[4].split('?')[0];
  
    if (!fileName) {
      throw new Error('Invalid imageUrl format');
    }
  
    const file = bucket.file(fileName);
    const [exists] = await file.exists();
  
    if (!exists) {
      throw new Error('File does not exist');
    }
  
    return new Promise((resolve, reject) => {
      file.delete((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}