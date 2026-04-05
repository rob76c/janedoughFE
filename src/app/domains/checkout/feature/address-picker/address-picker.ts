import { ViewPanel } from '@/src/app/shared/directives/view-panel';
import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MatRadioButton, MatRadioGroup } from "@angular/material/radio";
import { AddressService } from '../../data-access/address.service';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox'

@Component({
  selector: 'webapp-address-picker',
  imports: [ViewPanel, MatIcon, MatButton, MatRadioButton, MatRadioGroup],
  template: `
    <div webAppViewPanel>
      <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
        <mat-icon>{{ icon() }}</mat-icon>
        {{ title() }}
      </h2>
      <button matButton="filled" (click)="createNew.emit()">
          Create New
        </button>
      </div>
      @if (isLoading()) {
        <div class="flex justify-center p-4">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0055DE]"></div>
        </div>
      } @else if (addresses().length === 0) {
        <p class="text-gray-600 text-lg font-semibold">No addresses found! Please add an address.</p>
      } @else {
        <mat-radio-group 
          class="flex flex-col gap-4" 
          [value]="selectedAddressId()" 
          (change)="onAddressChange($event.value)">
          
          @for (address of addresses(); track address.addressId) {
            <mat-radio-button [value]="address.addressId" class="border border-gray-200 p-4 rounded-xl w-full hover:bg-gray-50 transition-colors">
              <div class="flex flex-col ml-2 leading-relaxed">
                <span class="font-semibold text-gray-900 text-base">
                  {{address.firstName}} {{address.lastName}}
                </span>
                <span class="text-gray-600 mt-1">
                  {{address.street}} {{address.addressLine2 ? ', ' + address.addressLine2 : ''}}
                </span>
                <span class="text-gray-600">
                  {{address.city}}, {{address.state}} {{address.zip}}
                </span>
                <span class="text-gray-600">{{address.country}}</span>
              </div>
            </mat-radio-button>
          }
        </mat-radio-group>

      }

    </div>
  `,
  styles: ``,
})
export class AddressPicker implements OnInit {
  addressService = inject(AddressService);

  title = input<string>('Shipping Address');
  icon = input<string>('local_shipping');
  addresses = signal<any[]>([]);
  isLoading = signal(true);
  selectedAddressId = signal<number | null>(null);

  shippingAddressId = input<number>();
  
  // Output event to notify checkout of the selection
  addressSelected = output<any>();
  createNew = output<void>();

  ngOnInit(): void {
    this.addressService.getUserAddresses().subscribe({
      next: (data: any[]) => {
        this.addresses.set(data);
        this.isLoading.set(false);
        
        // Auto-select the first address by default
        if (data.length > 0) {
          const shippingAddressId = this.shippingAddressId();
          const targetAddress = shippingAddressId ? data.find(a => a.addressId === shippingAddressId) || data[0] : data[0];

          this.selectedAddressId.set(targetAddress.addressId);
          this.addressSelected.emit(targetAddress);
        }
      },
      error: (err) => {
        console.error('Failed to fetch addresses', err);
        this.isLoading.set(false);
      }
    });
  }

  onAddressChange(addressId: number) {
    this.selectedAddressId.set(addressId);
    const selected = this.addresses().find(a => a.addressId === addressId);
    if (selected) {
      this.addressSelected.emit(selected);
    }
  }

}
