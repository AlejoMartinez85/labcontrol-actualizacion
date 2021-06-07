import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoIndexComponent } from './equipo-index.component';

describe('EquipoIndexComponent', () => {
  let component: EquipoIndexComponent;
  let fixture: ComponentFixture<EquipoIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipoIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipoIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
