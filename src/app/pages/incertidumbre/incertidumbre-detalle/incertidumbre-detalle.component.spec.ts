import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncertidumbreDetalleComponent } from './incertidumbre-detalle.component';

describe('IncertidumbreDetalleComponent', () => {
  let component: IncertidumbreDetalleComponent;
  let fixture: ComponentFixture<IncertidumbreDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncertidumbreDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncertidumbreDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
