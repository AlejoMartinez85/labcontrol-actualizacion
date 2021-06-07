import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DerivaInstrumentalComponent } from './deriva-instrumental.component';

describe('DerivaInstrumentalComponent', () => {
  let component: DerivaInstrumentalComponent;
  let fixture: ComponentFixture<DerivaInstrumentalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DerivaInstrumentalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivaInstrumentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
