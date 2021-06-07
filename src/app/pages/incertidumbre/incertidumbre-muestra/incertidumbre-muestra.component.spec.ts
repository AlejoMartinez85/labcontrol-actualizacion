import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncertidumbreMuestraComponent } from './incertidumbre-muestra.component';

describe('IncertidumbreMuestraComponent', () => {
  let component: IncertidumbreMuestraComponent;
  let fixture: ComponentFixture<IncertidumbreMuestraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncertidumbreMuestraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncertidumbreMuestraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
