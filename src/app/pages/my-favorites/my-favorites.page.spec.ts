import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyFavoritesPage } from './my-favorites.page';

describe('MyFavoritesPage', () => {
  let component: MyFavoritesPage;
  let fixture: ComponentFixture<MyFavoritesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFavoritesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
