import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncertidumbreDetalleVarComponent } from './incertidumbre-detalle-var.component';

describe('IncertidumbreDetalleVarComponent', () => {
  let component: IncertidumbreDetalleVarComponent;
  let fixture: ComponentFixture<IncertidumbreDetalleVarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncertidumbreDetalleVarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncertidumbreDetalleVarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
