import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigPlataformaSuperUserComponent } from './config-plataforma-super-user.component';

describe('ConfigPlataformaSuperUserComponent', () => {
  let component: ConfigPlataformaSuperUserComponent;
  let fixture: ComponentFixture<ConfigPlataformaSuperUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigPlataformaSuperUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigPlataformaSuperUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
