import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionViewComponent } from './configuracion-view.component';

describe('ConfiguracionViewComponent', () => {
  let component: ConfiguracionViewComponent;
  let fixture: ComponentFixture<ConfiguracionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfiguracionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
