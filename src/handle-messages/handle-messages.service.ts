import { Injectable } from '@nestjs/common';

@Injectable()
export class HandleMessagesService {
  constructor() {}

  async test(data: any) {
    console.log('test dududu', data);
  }
}
