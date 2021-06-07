import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepcionEnsayoComponent } from './recepcion-ensayo.component';

describe('RecepcionEnsayoComponent', () => {
  let component: RecepcionEnsayoComponent;
  let fixture: ComponentFixture<RecepcionEnsayoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecepcionEnsayoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecepcionEnsayoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
