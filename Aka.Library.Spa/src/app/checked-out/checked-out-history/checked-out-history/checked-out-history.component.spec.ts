import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckedOutHistoryComponent } from './checked-out-history.component';

describe('CheckedOutHistoryComponent', () => {
  let component: CheckedOutHistoryComponent;
  let fixture: ComponentFixture<CheckedOutHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckedOutHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckedOutHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
