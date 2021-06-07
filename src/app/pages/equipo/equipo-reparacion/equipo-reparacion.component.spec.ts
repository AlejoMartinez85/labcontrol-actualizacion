import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoReparacionComponent } from './equipo-reparacion.component';

describe('EquipoReparacionComponent', () => {
  let component: EquipoReparacionComponent;
  let fixture: ComponentFixture<EquipoReparacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipoReparacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipoReparacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
