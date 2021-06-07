import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearDerivaInstrumentalComponent } from './crear-deriva-instrumental.component';

describe('CrearDerivaInstrumentalComponent', () => {
  let component: CrearDerivaInstrumentalComponent;
  let fixture: ComponentFixture<CrearDerivaInstrumentalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearDerivaInstrumentalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearDerivaInstrumentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
