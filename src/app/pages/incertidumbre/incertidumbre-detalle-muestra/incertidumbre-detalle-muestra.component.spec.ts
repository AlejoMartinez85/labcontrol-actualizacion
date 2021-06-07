import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncertidumbreDetalleMuestraComponent } from './incertidumbre-detalle-muestra.component';

describe('IncertidumbreDetalleMuestraComponent', () => {
  let component: IncertidumbreDetalleMuestraComponent;
  let fixture: ComponentFixture<IncertidumbreDetalleMuestraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncertidumbreDetalleMuestraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncertidumbreDetalleMuestraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
