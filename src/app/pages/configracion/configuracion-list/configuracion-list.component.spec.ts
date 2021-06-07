import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionListComponent } from './configuracion-list.component';

describe('ConfiguracionListComponent', () => {
  let component: ConfiguracionListComponent;
  let fixture: ComponentFixture<ConfiguracionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfiguracionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
