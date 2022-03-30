export class CSVRecord {
  // csv fields
  public id: any;
  public Datum: any;
  public Von: any;
  public Bis: any;
  public Dauer: any;
  public Lohn: any;
  public mobile: any;
  public 'Interner Lohn': any;
  public Benutzer: any;
  public Name: any;
  public Kunde: any;
  public Projekt: any;
  public Tätigkeit: any;
  public Beschreibung: any;
  public Exportiert: any;
  public Abrechenbar: any;
  public Schlagworte: any;
  public Stundenlohn: any;
  public Festbetrag: any;
  public Typ: any;
  public 'label.category': any;
  public Kundennummer: any;
  public 'Umsatzsteuer-ID': any;
  public Bestellnummer: any;
  // not a csv field
  public Nachname: any;
  public Betriebsnummer: any;
  public PersonalNr: any;
  public Pause?: string;
}

export interface ExportedCSV {
  Betriebsnummer: string;
  Nachname: string;
  Vorname: string;
  PersonalNr: string;
  Datum: string;
  Beginn: string;
  Ende: string;
  Pause: string;
}
