export class ColumnNumberTransformer {
  public to(data: number): number {
    return data;
  }

  public from(data: string): number {
    return parseInt(data);
  }
}

import * as moment from 'moment-timezone';
import * as fs from 'fs';

export class WriteLogs {
  constructor() {
    const dir = 'src/logs';

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    const log = console.log;
    console.log = function (...data) {
      log(...data);

      const date = moment().tz('Asia/Seoul').format('yyyy-MM-DD');
      const logFile = fs.createWriteStream(dir + '/log_' + date + '.txt', {
        flags: 'a',
      });
      const time = moment().tz('Asia/Seoul').format('yyyy-MM-DD HH:mm:ss');
      if (arguments && arguments.length) {
        logFile.write(`[${time}] - ` + JSON.stringify(arguments) + '\n');
      }
    };

    console.error = console.log;
  }
}
