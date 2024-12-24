import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchingUsersPage } from './matching-users.page';

describe('MatchingUsersPage', () => {
  let component: MatchingUsersPage;
  let fixture: ComponentFixture<MatchingUsersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchingUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
