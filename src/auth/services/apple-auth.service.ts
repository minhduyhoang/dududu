import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { jwtDecode, JwtHeader } from 'jwt-decode';
import { AxiosService } from 'src/utils/http/axios.service';
import { IVerifyInfo } from '../auth.interface';

type JwtTokenSchema = {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: string;
  nonce: string;
  c_hash: string;
  email: string;
  email_verified: string;
  is_private_email: string;
  auth_time: number;
};

@Injectable()
export class AppleAuthService {
  private readonly appleIdAuthKeyUrl: string;
  private readonly appleIdUrl: string;
  private readonly appClientId: string;

  constructor(private readonly configService: ConfigService, private readonly axiosService: AxiosService) {
    this.appleIdAuthKeyUrl = this.configService.get<string>('APPLE_AUTH_KEY_URL') || 'https://appleid.apple.com/auth/keys';
    this.appleIdUrl = this.configService.get<string>('APPLE_URL') || 'https://appleid.apple.com';
    this.appClientId = this.configService.get<string>('APPLE_CLIENT_ID');
  }

  private async validateTokenAndDecode(token: string): Promise<JwtTokenSchema | boolean> {
    const tokenDecodedHeader: JwtHeader & { kid: string } = jwtDecode<JwtHeader & { kid: string }>(token, {
      header: true,
    });

    const resAxios: any = await this.axiosService.get(this.appleIdAuthKeyUrl);

    const applePublicKey: { keys: Array<{ [key: string]: string }> } = resAxios?.data;

    const client: jwksClient.JwksClient = jwksClient({
      jwksUri: this.appleIdAuthKeyUrl,
    });

    const kid: string = tokenDecodedHeader.kid;
    const sharedKid: string = applePublicKey?.keys.filter((x) => x['kid'] === kid)[0]?.['kid'];
    const key: jwksClient.CertSigningKey | jwksClient.RsaSigningKey = await client.getSigningKey(sharedKid);

    const signingKey: string = key.getPublicKey();

    if (!signingKey) return false;

    const res: JwtTokenSchema = <JwtTokenSchema>jwt.verify(token, signingKey);

    if (res.iss !== this.appleIdUrl || res.aud !== this.appClientId) return false;

    return res;
  }

  public async authenticate(idToken: string): Promise<IVerifyInfo | { error: boolean }> {
    try {
      const jwt: JwtTokenSchema | boolean = await this.validateTokenAndDecode(idToken);

      if (typeof jwt === 'boolean') return { error: true };

      const verifyData: IVerifyInfo = {
        socialId: jwt.sub,
        email: jwt.email,
      };

      return verifyData;
    } catch (error) {
      console.log('APPLE VERIFY FAIL: ', error);
      return { error: true };
    }
  }
}
