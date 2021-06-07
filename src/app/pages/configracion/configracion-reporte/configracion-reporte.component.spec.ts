import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigracionReporteComponent } from './configracion-reporte.component';

describe('ConfigracionReporteComponent', () => {
  let component: ConfigracionReporteComponent;
  let fixture: ComponentFixture<ConfigracionReporteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigracionReporteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigracionReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
