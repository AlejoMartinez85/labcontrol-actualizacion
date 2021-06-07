import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncertidumbreValidacionesComponent } from './incertidumbre-validaciones.component';

describe('IncertidumbreValidacionesComponent', () => {
  let component: IncertidumbreValidacionesComponent;
  let fixture: ComponentFixture<IncertidumbreValidacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncertidumbreValidacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncertidumbreValidacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
