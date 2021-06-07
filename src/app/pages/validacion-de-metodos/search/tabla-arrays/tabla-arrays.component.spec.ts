import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaArraysComponent } from './tabla-arrays.component';

describe('TablaArraysComponent', () => {
  let component: TablaArraysComponent;
  let fixture: ComponentFixture<TablaArraysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaArraysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaArraysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
