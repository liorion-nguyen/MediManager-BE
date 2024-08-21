import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from './firebase.key.json';
import { FirebaseService } from './firebase.service';
import { FirebaseController } from './firebase.controller';

@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: () => {
        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
          storageBucket: process.env.URL_Bucket_Firebase,
        });
      },
    },
    FirebaseService,
  ],
  controllers: [FirebaseController], 
  exports: [FirebaseService], 
})
export class FirebaseModule {}
