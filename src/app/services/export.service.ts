import { Injectable } from '@angular/core';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { ExportedCSV } from '../csv-parser/csv-record';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  readonly CSV_EXTENSION = 'exported_csv';
  readonly CSV_TYPE = 'csv';
  readonly options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: false,
    title: '',
    useBom: true,
    noDownload: false,
    headers: [
      'Betriebs-Nr.',
      'Nachname',
      'Vorname',
      'Pers.-Nr',
      'Datum',
      'Beginn',
      'Ende',
      'Pause',
    ],
    useHeader: false,
    nullToEmptyString: true,
  };

  exportToCsv(csvDataSets: ExportedCSV[]) {
    new AngularCsv(csvDataSets, 'Exported Data', this.options);
  }
}
