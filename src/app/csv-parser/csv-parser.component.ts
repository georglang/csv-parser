import { Component, OnInit, ViewChild } from '@angular/core';
import { CSVRecord } from './csv-record';

@Component({
  selector: 'app-csv-parser',
  templateUrl: './csv-parser.component.html',
  styleUrls: ['./csv-parser.component.scss'],
})
export class CsvParserComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  public arrWithAllDates: any[] = [];

  public records: CSVRecord[] = [];
  @ViewChild('csvReader') csvReader: any;
  uploadListener($event: any): void {
    let text = [];
    let files = $event.srcElement.files;
    if (this.isValidCSVFile(files[0])) {
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        let headersRow = this.getHeaderArray(csvRecordsArray);
        this.records = this.getDataRecordsArrayFromCSVFile(
          csvRecordsArray,
          headersRow.length
        );
      };
      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };
    } else {
      alert('Please import valid .csv file.');
      this.fileReset();
    }
  }

  private removeQuote(csvRecord: CSVRecord) {
    // const csvWithoutQuotes: CSVRecord;
    for (const [key, value] of Object.entries(csvRecord)) {
      value.replace(/"/g, '');
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        let csvRecord: CSVRecord = new CSVRecord();

        // const date = curruntRecord[0].trim().replace(/'/g, '"');

        const date = curruntRecord[0].substring(3, 11);

        csvRecord.Datum = date;
        csvRecord.Von = curruntRecord[1].trim().replace(/"/g, '');
        csvRecord.Bis = curruntRecord[2].trim().replace(/"/g, '');

        this.test(date, csvRecord.Von, csvRecord.Bis);

        csvRecord.Dauer = curruntRecord[3].trim().replace(/"/g, '');
        csvRecord.Lohn = curruntRecord[4].trim().replace(/"/g, '');
        // csvRecord."Interner Lohn" = curruntRecord[5].trim();
        csvRecord.Benutzer = curruntRecord[6].trim().replace(/"/g, '');
        csvRecord.Name = curruntRecord[7]
          .trim()
          .split(/(\s+)/)
          .filter((e) => e.trim().length > 0)[1]
          .replace(/"/g, '');
        console.log('Name: ', csvRecord.Name);

        csvRecord.Nachname = curruntRecord[7]
          .trim()
          .split(/(\s+)/)
          .filter((e) => e.trim().length > 0)[0]
          .replace(/"/g, '');

        csvRecord.Kunde = curruntRecord[8].trim().replace(/"/g, '');
        csvRecord.Projekt = curruntRecord[9].trim().replace(/"/g, '');
        csvRecord.Tätigkeit = curruntRecord[10].trim().replace(/"/g, '');
        csvRecord.Beschreibung = curruntRecord[11].trim().replace(/"/g, '');
        csvRecord.Exportiert = curruntRecord[12].trim().replace(/"/g, '');
        csvRecord.Abrechenbar = curruntRecord[13].trim().replace(/"/g, '');
        csvRecord.Schlagworte = curruntRecord[14].trim().replace(/"/g, '');
        csvRecord.Stundenlohn = curruntRecord[15].trim().replace(/"/g, '');
        csvRecord.Festbetrag = curruntRecord[16].trim().replace(/"/g, '');
        csvRecord.Typ = curruntRecord[17].trim().replace(/"/g, '');
        // csvRecord."label.category" = curruntRecord[18].trim();
        csvRecord.Kundennummer = curruntRecord[19].trim().replace(/"/g, '');
        // csvRecord."Umsatzsteuer-ID" = curruntRecord[20].trim();
        // csvRecord.Bestellnummer = curruntRecord[21].trim();

        this.removeQuote(csvRecord);

        csvArr.push(csvRecord);
      }
    }
    console.log('ARRRRrrrrr', csvArr);

    const testArr: CSVRecord[][] = new Array();
    //  0  1  2
    // testArr.push([1, 2, 3]);   // 0
    // testArr.push([2, 3, 4]);   // 1
    // testArr.push([5, 6, 7]);   // 2

    // sort regarding date into array
    let remember = 0;
    for (let i = 0; i < csvArr.length; i++) {
      if (i === 0) {
        testArr.push([csvArr[0]]);
      } else {
        if (csvArr[i].Datum === csvArr[i - 1].Datum) {
          testArr[remember].push(csvArr[i]);
        } else {
          remember += 1;
          testArr.push([csvArr[i]]);
        }
      }
    }

    // sort time

    console.log('Test Arr: ', testArr);

    // for (var property in obj1) {
    //   if (obj1[property] == obj2[property])
    //     obj_common[property] = obj1[property];
    // }

    return csvArr;
  }
  isValidCSVFile(file: any) {
    return file.name.endsWith('.csv');
  }
  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }
  fileReset() {
    this.csvReader.nativeElement.value = '';
    this.records = [];
  }

  test(date: any, from: string, to: string) {
    const hello = date.replace(/'/g, '"');
    // console.log('Date', new Date(hello).toLocaleDateString('de-DE'));

    if (this.arrWithAllDates.length === 0) {
      this.arrWithAllDates.push(hello);
    }

    // const project = {
    //   date: date,
    //   from: from,
    //   to: to,
    // };

    // this.arrWithAllDates.push(project);

    // const test = this.arrWithAllDates.filter(
    //   (date, i, self) =>
    //     self.findIndex((d) => d.getTime() === date.getTime()) === i
    // );

    // console.log('Test', test);
  }

  removeCharAtIndex(index: number, str: string) {
    var maxIndex = index == 0 ? 0 : index;
    return str.substring(0, maxIndex) + str.substring(index, str.length);
  }
}

// Gleichen Benutzer
// Gleiches Datum und
