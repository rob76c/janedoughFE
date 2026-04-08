import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsDialog } from './order-details-dialog';

describe('OrderDetailsDialog', () => {
  let component: OrderDetailsDialog;
  let fixture: ComponentFixture<OrderDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetailsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDetailsDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
