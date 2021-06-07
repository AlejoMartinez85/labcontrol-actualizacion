import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoAddComponent } from './equipo-add.component';

describe('EquipoAddComponent', () => {
  let component: EquipoAddComponent;
  let fixture: ComponentFixture<EquipoAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipoAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipoAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
