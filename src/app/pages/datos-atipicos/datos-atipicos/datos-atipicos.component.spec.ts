import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosAtipicosComponent } from './datos-atipicos.component';

describe('DatosAtipicosComponent', () => {
  let component: DatosAtipicosComponent;
  let fixture: ComponentFixture<DatosAtipicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosAtipicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosAtipicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
