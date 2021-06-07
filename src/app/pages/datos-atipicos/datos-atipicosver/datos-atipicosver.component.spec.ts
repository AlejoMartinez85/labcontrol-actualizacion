import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosAtipicosverComponent } from './datos-atipicosver.component';

describe('DatosAtipicosverComponent', () => {
  let component: DatosAtipicosverComponent;
  let fixture: ComponentFixture<DatosAtipicosverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosAtipicosverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosAtipicosverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
