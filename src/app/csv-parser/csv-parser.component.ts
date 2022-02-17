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

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let currentRecord = (<string>csvRecordsArray[i]).split(',');
      if (currentRecord.length == headerLength) {
        let csvRecord: CSVRecord = new CSVRecord();
        const cleanRecord = this.removeQuotes(csvRecord, currentRecord);

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
  private removeQuotes(
    csvRecord: CSVRecord,
    currentRecord: string[]
  ): CSVRecord {
    csvRecord.Datum = currentRecord[0].substring(3, 11);
    csvRecord.Von = currentRecord[1].trim().replace(/"/g, '');
    csvRecord.Bis = currentRecord[2].trim().replace(/"/g, '');
    csvRecord.Dauer = currentRecord[3].trim().replace(/"/g, '');
    csvRecord.Lohn = currentRecord[4].trim().replace(/"/g, '');
    // csvRecord."Interner Lohn" = curruntRecord[5].trim();
    csvRecord.Benutzer = currentRecord[6].trim().replace(/"/g, '');
    csvRecord.Name = currentRecord[7]
      .trim()
      .split(/(\s+)/)
      .filter((e) => e.trim().length > 0)[1]
      .replace(/"/g, '');
    console.log('Name: ', csvRecord.Name);

    csvRecord.Nachname = currentRecord[7]
      .trim()
      .split(/(\s+)/)
      .filter((e) => e.trim().length > 0)[0]
      .replace(/"/g, '');

    csvRecord.Kunde = currentRecord[8].trim().replace(/"/g, '');
    csvRecord.Projekt = currentRecord[9].trim().replace(/"/g, '');
    csvRecord.Tätigkeit = currentRecord[10].trim().replace(/"/g, '');
    csvRecord.Beschreibung = currentRecord[11].trim().replace(/"/g, '');
    csvRecord.Exportiert = currentRecord[12].trim().replace(/"/g, '');
    csvRecord.Abrechenbar = currentRecord[13].trim().replace(/"/g, '');
    csvRecord.Schlagworte = currentRecord[14].trim().replace(/"/g, '');
    csvRecord.Stundenlohn = currentRecord[15].trim().replace(/"/g, '');
    csvRecord.Festbetrag = currentRecord[16].trim().replace(/"/g, '');
    csvRecord.Typ = currentRecord[17].trim().replace(/"/g, '');
    // csvRecord."label.category" = curruntRecord[18].trim();
    csvRecord.Kundennummer = currentRecord[19].trim().replace(/"/g, '');
    // csvRecord."Umsatzsteuer-ID" = curruntRecord[20].trim();
    // csvRecord.Bestellnummer = curruntRecord[21].trim();

    return csvRecord;
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  private isValidCSVFile(file: any) {
    return file.name.endsWith('.csv');
  }

  private fileReset() {
    this.csvReader.nativeElement.value = '';
    this.records = [];
  }
}
