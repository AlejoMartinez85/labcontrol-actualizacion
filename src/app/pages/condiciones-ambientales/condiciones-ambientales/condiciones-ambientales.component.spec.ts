import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CondicionesAmbientalesComponent } from './condiciones-ambientales.component';

describe('CondicionesAmbientalesComponent', () => {
  let component: CondicionesAmbientalesComponent;
  let fixture: ComponentFixture<CondicionesAmbientalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CondicionesAmbientalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CondicionesAmbientalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
