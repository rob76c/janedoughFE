import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistPreview } from './wishlist-preview';

describe('WishlistPreview', () => {
  let component: WishlistPreview;
  let fixture: ComponentFixture<WishlistPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishlistPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishlistPreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
