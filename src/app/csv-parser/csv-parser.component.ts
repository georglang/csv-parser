import { Component, ViewChild } from '@angular/core';
import { CSVRecord, ExportedCSV } from './csv-record';
import { ExportService } from '../services/export.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-csv-parser',
  templateUrl: './csv-parser.component.html',
  styleUrls: ['./csv-parser.component.scss'],
})
export class CsvParserComponent {
  @ViewChild('csvReader') csvReader: any;
  companyNumber = '1020200';
  private readonly snackbarDuration = 4000000;
  records: CSVRecord[] = [];
  dataSource: CSVRecord[] = [];
  displayedColumns: string[] = [
    'Betriebsnummer',
    'Nachname',
    'Vorname',
    'PersonalNr',
    'Datum',
    'Beginn',
    'Ende',
    'Pause',
  ];

  constructor(
    private matSnackbar: MatSnackBar,
    private exportService: ExportService
  ) {}

  uploadListener($event: any): void {
    let files = $event.srcElement.files;
    if (this.isValidCSVFile(files[0])) {
      const input = $event.target;
      const reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = () => {
        const csvData = reader.result;
        const csvEntiresArray: string[] = (<string>csvData).split(/\r\n|\n/);
        const headersRow = this.getHeaderArray(csvEntiresArray);
        this.records = this.getDataRecordsArrayFromCSVFile(
          csvEntiresArray,
          headersRow.length
        );
        this.dataSource = this.records;
      };
      reader.onerror = () => {
        this.openSnackbarErrorMessage(
          'Fehler ist während des Ladens der CSV-Datei aufgetreten'
        );
      };
    } else {
      this.openSnackbarErrorMessage('Bitte wählen Sie eine .csv Datei aus');
      this.fileReset();
    }
  }

  onKeypressEvent(event: any, recordId: string): void {
    this.records.forEach((csvRecord: CSVRecord) => {
      if (csvRecord.id === recordId) {
        csvRecord.PersonalNr = event.target.value;
      }
    });
  }

  exportAsCsv(): void {
    const csvExport: ExportedCSV[] = [];
    if (this.records.length > 0) {
      this.records.map((csvDataSet: CSVRecord) => {
        csvExport.push({
          Betriebsnummer: this.companyNumber,
          Nachname: csvDataSet.Nachname,
          Vorname: csvDataSet.Name,
          PersonalNr: csvDataSet.PersonalNr,
          Datum: this.formatDateForExport(csvDataSet.Datum),
          Beginn: csvDataSet.Von,
          Ende: csvDataSet.Bis,
          Pause: csvDataSet.Pause!,
        });
      });
    }
    if (csvExport.length > 0) {
      this.exportService.exportToCsv(csvExport);
    }
  }

  private openSnackbarErrorMessage(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = this.snackbarDuration;
    config.panelClass = ['snackbar-error-message'];
    config.horizontalPosition = 'center';

    this.matSnackbar.open(message, '', config);
  }

  private getDataRecordsArrayFromCSVFile(
    csvRecordsArray: string[],
    headerLength: number
  ): CSVRecord[] {
    const csvRecords: CSVRecord[] = [];
    for (let i = 1; i < csvRecordsArray.length; i++) {
      const currentRecord = (<string>csvRecordsArray[i]).split(',');
      if (currentRecord.length == headerLength) {
        const recordWithoutQuotes = this.removeQuotes(currentRecord);
        csvRecords.push(this.setValues(recordWithoutQuotes));
      }
    }

    const recordsSortedByDateAndTime = this.convertToDate(
      this.sortByDate(csvRecords)
    );
    recordsSortedByDateAndTime.forEach((record) => {
      this.sortByTime(record);
    });

    return this.convertTwoDimensionalIntoOneDimensionalArray(
      this.sortByName(recordsSortedByDateAndTime)
    );
  }

  private setValues(csvRecord: CSVRecord): CSVRecord {
    csvRecord.id = csvRecord.Benutzer.toLowerCase().replace(/ /g, '-');
    csvRecord.Betriebsnummer = this.companyNumber;
    const user = csvRecord.Benutzer.split(/(\s+)/);
    csvRecord.Name = user[0];
    csvRecord.Nachname = user[2];
    return csvRecord;
  }

  private convertToDate(recordsByDate: CSVRecord[][]): CSVRecord[][] {
    for (let i = 0; i < recordsByDate.length; i++) {
      const record = recordsByDate[i];
      for (let j = 0; j < record.length; j++) {
        record[j].Datum = new Date(record[j].Datum);
      }
    }
    return recordsByDate;
  }

  private formatDateForExport(date: Date): string {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [day, month, year].join('.');
  }

  private sortByDate(csvArr: CSVRecord[]): CSVRecord[][] {
    const records: CSVRecord[][] = [];
    let remember = 0;
    for (let i = 0; i < csvArr.length; i++) {
      if (i === 0) {
        records.push([csvArr[0]]);
      } else {
        if (csvArr[i].Datum === csvArr[i - 1].Datum) {
          records[remember].push(csvArr[i]);
        } else {
          remember += 1;
          records.push([csvArr[i]]);
        }
      }
    }
    return records;
  }

  private sortByTime(csvRecords: CSVRecord[]): CSVRecord[] {
    let from, to;
    for (let record of csvRecords) {
      from = record.Von;
      to = record.Bis;

      csvRecords.sort(function (x, y) {
        return x.Von - y.Von;
      });
    }
    return csvRecords;
  }

  private sortByName(csvRecord: CSVRecord[][]): CSVRecord[][] {
    for (let records of csvRecord) {
      records.sort((a, b) => a.Benutzer.localeCompare(b.Benutzer));

      for (let i = 0; i < records.length; i++) {
        if (records[i + 1]) {
          if (records[i].Benutzer === records[i + 1].Benutzer) {
            const from = new Date(`01/01/2022 ${records[i].Von}`);
            const to = new Date(`01/01/2022 ${records[i + 1].Bis}`);

            const difference = from.getTime() - to.getTime();
            const result = new Date(difference).toISOString().slice(11, 19); // HH:MM:SS
            records[i + 1].Pause = result;
          }
        }
      }
    }
    return csvRecord;
  }

  private removeQuotes(currentRecord: string[]): CSVRecord {
    const centuryPrefix = '20';
    const csvRecord: CSVRecord = new CSVRecord();
    csvRecord.Datum = centuryPrefix.concat(currentRecord[0]?.substring(3, 11));
    csvRecord.Von = currentRecord[1]?.trim().replace(/"/g, '');
    csvRecord.Bis = currentRecord[2]?.trim().replace(/"/g, '');
    csvRecord.Dauer = currentRecord[3]?.trim().replace(/"/g, '');
    csvRecord.Lohn = currentRecord[4]?.trim().replace(/"/g, '');
    // csvRecord."Interner Lohn" = curruntRecord[5].trim();
    csvRecord.Benutzer = currentRecord[6]?.trim().replace(/"/g, '');
    csvRecord.Name = currentRecord[7]
      ?.trim()
      .split(/(\s+)/)
      .filter((e) => {
        e?.trim().length > 0;
      })[1]
      ?.replace(/"/g, '');

    csvRecord.Nachname = currentRecord[7]
      .trim()
      .split(/(\s+)/)
      .filter((e) => e.trim()?.length > 0)[0]
      ?.replace(/"/g, '');

    csvRecord.Kunde = currentRecord[8]?.trim().replace(/"/g, '');
    csvRecord.Projekt = currentRecord[9]?.trim().replace(/"/g, '');
    csvRecord.Tätigkeit = currentRecord[10]?.trim().replace(/"/g, '');
    csvRecord.Beschreibung = currentRecord[11]?.trim().replace(/"/g, '');
    csvRecord.Exportiert = currentRecord[12]?.trim().replace(/"/g, '');
    csvRecord.Abrechenbar = currentRecord[13]?.trim().replace(/"/g, '');
    csvRecord.Schlagworte = currentRecord[14]?.trim().replace(/"/g, '');
    csvRecord.Stundenlohn = currentRecord[15]?.trim().replace(/"/g, '');
    csvRecord.Festbetrag = currentRecord[16]?.trim().replace(/"/g, '');
    csvRecord.Typ = currentRecord[17]?.trim().replace(/"/g, '');
    // csvRecord."label.category" = curruntRecord[18].trim();
    csvRecord.Kundennummer = currentRecord[19]?.trim().replace(/"/g, '');
    // csvRecord."Umsatzsteuer-ID" = curruntRecord[20].trim();
    // csvRecord.Bestellnummer = curruntRecord[21].trim();
    csvRecord.Pause = '00:00';

    return csvRecord;
  }

  private convertTwoDimensionalIntoOneDimensionalArray(
    csvRecords: CSVRecord[][]
  ): CSVRecord[] {
    const recordsOneDimensionalArr: CSVRecord[] = [];
    for (let i = 0; i < csvRecords.length; i++) {
      const cube = csvRecords[i];
      for (let j = 0; j < cube.length; j++) {
        recordsOneDimensionalArr.push(cube[j]);
      }
    }
    return recordsOneDimensionalArr;
  }

  private getHeaderArray(csvRecordsArr: string[]): string[] {
    const headers: string[] = (<string>csvRecordsArr[0]).split(',');
    const headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  private isValidCSVFile(file: File): boolean {
    return file.name.endsWith('.csv');
  }

  private fileReset(): void {
    this.csvReader.nativeElement.value = '';
    this.records = [];
  }
}

// ToDo
// "Text noch keine CSV Daten geladen"
// Evtl. Anzeige in schönerer Tabel
