import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearMatrizDatosAtipicosComponent } from './crear-matriz-datos-atipicos.component';

describe('CrearMatrizDatosAtipicosComponent', () => {
  let component: CrearMatrizDatosAtipicosComponent;
  let fixture: ComponentFixture<CrearMatrizDatosAtipicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearMatrizDatosAtipicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearMatrizDatosAtipicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
