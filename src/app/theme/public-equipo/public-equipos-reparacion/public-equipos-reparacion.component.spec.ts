import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicEquiposReparacionComponent } from './public-equipos-reparacion.component';

describe('PublicEquiposReparacionComponent', () => {
  let component: PublicEquiposReparacionComponent;
  let fixture: ComponentFixture<PublicEquiposReparacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicEquiposReparacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicEquiposReparacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
