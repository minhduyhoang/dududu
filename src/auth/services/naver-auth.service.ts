import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosService } from "src/utils/http/axios.service";
import { IVerifyInfo } from "../auth.interface";

@Injectable()
export class NaverAuthService {
  private readonly clientHost: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly axiosService: AxiosService,
  ) {
    this.clientHost = this.configService.get<string>("NAVER_AUTH_ACCESS_LINK");
  }

  public async authenticate(
    accessToken: string,
  ): Promise<IVerifyInfo | { error: boolean }> {
    try {
      const axiosResponse: any = await this.axiosService.get(this.clientHost, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data: any = axiosResponse?.data?.response || null;

      if (!data) return { error: true };

      const verifyData: IVerifyInfo = {
        socialId: data?.id.toString() || null,
        email: data?.email || null,
      };

      return verifyData;
    } catch (error) {
      console.error("KAKAO VERIFY FAIL: ", error);

      return { error: true };
    }
  }
}
