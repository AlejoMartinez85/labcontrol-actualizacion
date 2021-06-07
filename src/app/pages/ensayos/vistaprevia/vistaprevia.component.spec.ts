import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VistapreviaComponent } from './vistaprevia.component';

describe('VistapreviaComponent', () => {
  let component: VistapreviaComponent;
  let fixture: ComponentFixture<VistapreviaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VistapreviaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VistapreviaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
