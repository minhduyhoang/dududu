import { Injectable } from '@nestjs/common';
import * as xl from 'excel4node';
import { Response } from 'express';
import * as moment from 'moment-timezone';

@Injectable()
export class ExportExcelService {
  private border: any;
  private numberFormat: any;
  private bgStyle: any;
  private stringFormat: any;
  constructor() {
    this.border = {
      border: {
        left: {
          style: 'thin',
          color: '#000000',
        },
        right: {
          style: 'thin',
          color: '#000000',
        },
        top: {
          style: 'thin',
          color: '#000000',
        },
        bottom: {
          style: 'thin',
          color: '#000000',
        },
        outline: false,
      },
    };

    this.stringFormat = {
      alignment: {
        horizontal: 'center',
      },
    };

    this.numberFormat = {
      numberFormat: '#,##0; -#,##0; 0',
    };

    this.bgStyle = {
      fill: {
        type: 'pattern',
        patternType: 'solid',
        bgColor: 'ffffff',
        fgColor: 'ffffff',
      },
      font: {
        color: '#000000',
      },
    };
  }
  export(data = [], headers = [], name = '', response: Response, width = 25) {
    // File name
    let titleName = name.split(' ').join('-').toLowerCase();
    const title = titleName + '-' + moment().format('yyyy-MM-DD');
    const fileName = title + '.xlsx';
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Sheet 1');

    const boldCenterStyle = wb.createStyle({
      font: {
        bold: true,
        color: '#000000',
      },
      alignment: {
        horizontal: 'center',
      },
    });

    const styleString = wb.createStyle(Object.assign(this.stringFormat, this.bgStyle, this.border));
    const styleNumber = wb.createStyle(Object.assign(this.numberFormat, this.bgStyle, this.border));

    const TOTAL_COLUMNS = headers.length;

    for (let i = 1; i <= TOTAL_COLUMNS; i++) {
      switch (i) {
        case 1:
          ws.column(i).setWidth(5);
          break;
        default:
          ws.column(i).setWidth(width);
          break;
      }
    }

    headers.forEach((header, i) => {
      ws.cell(1, i + 1)
        .string(header.name)
        .style(boldCenterStyle)
        .style(styleString)
        .style({
          fill: {
            bgColor: '#dfdedb',
            fgColor: '#dfdedb',
          },
        });
    });

    let rowCount = 2;
    data.forEach((item, i) => {
      let index = 0;
      headers.forEach((header) => {
        const value = header.key === 'id' ? ++i : header.subKey ? item[header.key][header.subKey] : item[header.key];

        if (typeof value !== 'undefined') {
          switch (typeof value) {
            case 'number':
              ws.cell(rowCount, ++index)
                .number(Number(value) || 0)
                .style(styleNumber);
              break;
            case 'object':
              if (value instanceof Date) {
                ws.cell(rowCount, ++index)
                  .string(moment(value).format('yyyy-MM-DD HH:mm:ss'))
                  .style(styleString);
              } else {
                if (value === null) {
                  ws.cell(rowCount, ++index)
                    .string('')
                    .style(styleString);
                } else {
                  ws.cell(rowCount, ++index)
                    .string(value)
                    .style(styleString);
                }
              }
              break;
            case 'boolean':
              ws.cell(rowCount, ++index)
                .bool(value)
                .style(styleString);
              break;
            default:
              ws.cell(rowCount, ++index)
                .string(value)
                .style(styleString);
              break;
          }
        } else {
          ws.cell(rowCount, ++index)
            .string('')
            .style(styleString);
        }
      });
      rowCount++;
    });

    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
    wb.write(fileName, response);
  }

}
