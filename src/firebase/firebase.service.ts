import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { messaging } from 'firebase-admin';
import { IVerifyInfo } from 'src/auth/auth.interface';
import * as firebaseConfig from './firebase.config.json';

const firebase_params = {
  type: firebaseConfig.type,
  projectId: firebaseConfig.project_id,
  privateKeyId: firebaseConfig.private_key_id,
  privateKey: firebaseConfig.private_key,
  clientEmail: firebaseConfig.client_email,
  clientId: firebaseConfig.client_id,
  authUri: firebaseConfig.auth_uri,
  tokenUri: firebaseConfig.token_uri,
  authProviderX509CertUrl: firebaseConfig.auth_provider_x509_cert_url,
  clientC509CertUrl: firebaseConfig.client_x509_cert_url,
};
const firebaseAdmin = firebase.initializeApp({
  credential: firebase.credential.cert(firebase_params),
});
@Injectable()
export class FirebaseService {
  constructor() {}

  public async authenticate(token: string): Promise<IVerifyInfo | { error }> {
    try {
      const firebaseUser: any = await firebaseAdmin
        .auth()
        .verifyIdToken(token, true)
        .catch((error) => {
          console.log('GOOGLE VERIFY FAIL: ', error);
          return false;
        });

      if (!firebaseUser) {
        return { error: true };
      }

      const verifyData: IVerifyInfo = {
        socialId: firebaseUser?.sub,
        email: firebaseUser?.email,
      };

      return verifyData;
    } catch (error) {
      console.log('GOOGLE VERIFY FAIL: ', error);
      return { error: true };
    }
  }

  public async sendToTopic(topic: string, notification: any, dataSend?: {}): Promise<void> {
    let message: messaging.MessagingPayload = {
      notification: notification,
      data: dataSend,
    };

    firebaseAdmin
      .messaging()
      .sendToTopic(topic, message)
      .then((response) => {
        console.log('Successfully sent message: ', topic);
        console.log(response);
      })
      .catch((error) => {
        console.error('Error sending message: ', topic);
        console.error(error);
      });
  }

  public async sendToDevice(deviceTokens: string[], payload: messaging.MessagingPayload): Promise<void> {
    const message = {
      tokens: deviceTokens,
      notification: {
        title: 'abcd',
        body: 'abcd',
      },
      data: {
        score: '850',
        time: '2:45',
      },
    };

    return firebaseAdmin
      .messaging()
      .sendEachForMulticast(message)
      .then((res: messaging.BatchResponse) => {
        console.log('Res push noti:', res?.responses[0]);

        if (res.successCount && res.successCount === 1) console.log('Successfully sent message');
        else console.log('Error sending message');
      })
      .catch((error) => {
        console.log('error', error);
        return console.log('Error sending message');
      });
  }

  public async subscribeTopic(deviceTokens: string | string[], topicName: string): Promise<void> {
    if (typeof deviceTokens === 'string') deviceTokens = [deviceTokens];

    firebaseAdmin
      .messaging()
      .subscribeToTopic(deviceTokens, topicName)
      .then((response) => {
        console.log('Successfully subscribe device to topic: ', topicName);
        console.log(response);
      })
      .catch((error) => {
        console.error('Error subscribe device to topic: ', topicName);
        console.error(error);
      });
  }

  public async unSubscribeTopic(deviceTokens: string[], topicName: string): Promise<void> {
    firebaseAdmin
      .messaging()
      .unsubscribeFromTopic(deviceTokens, topicName)
      .then((response) => {
        console.log('Successfully unsubscribe device to topic: ', topicName);
        console.log(response);
      })
      .catch((error) => {
        console.error('Error unsubscribe device to topic: ', topicName);
        console.error(error);
      });
  }
}
