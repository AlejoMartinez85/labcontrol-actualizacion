import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerDerivaInstrumentalComponent } from './ver-deriva-instrumental.component';

describe('VerDerivaInstrumentalComponent', () => {
  let component: VerDerivaInstrumentalComponent;
  let fixture: ComponentFixture<VerDerivaInstrumentalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerDerivaInstrumentalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerDerivaInstrumentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
