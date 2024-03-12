import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { map } from "rxjs/operators";
import { AxiosRequestConfig } from "axios";
import { lastValueFrom } from "rxjs";

@Injectable()
export class AxiosService {
  constructor(private readonly httpService: HttpService) {}

  public async get(
    url: string,
    configuration?: AxiosRequestConfig,
  ): Promise<any> {
    return lastValueFrom(
      this.httpService.get(url, configuration).pipe(
        map((res) => {
          return res || null;
        }),
      ),
    );
  }

  public async post(
    url: string,
    data: any,
    configuration?: AxiosRequestConfig,
  ): Promise<any> {
    return lastValueFrom(
      this.httpService.post(url, data, configuration).pipe(
        map((res) => {
          return res || null;
        }),
      ),
    );
  }
}
