import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CondicionesAmbientalesVerComponent } from './condiciones-ambientales-ver.component';

describe('CondicionesAmbientalesVerComponent', () => {
  let component: CondicionesAmbientalesVerComponent;
  let fixture: ComponentFixture<CondicionesAmbientalesVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CondicionesAmbientalesVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CondicionesAmbientalesVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
