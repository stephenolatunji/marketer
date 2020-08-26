import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmOnlineComponent } from './am-online.component';

describe('AmOnlineComponent', () => {
  let component: AmOnlineComponent;
  let fixture: ComponentFixture<AmOnlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmOnlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
