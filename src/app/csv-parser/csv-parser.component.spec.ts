/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CsvParserComponent } from './csv-parser.component';

describe('CsvParserComponent', () => {
  let component: CsvParserComponent;
  let fixture: ComponentFixture<CsvParserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvParserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvParserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
