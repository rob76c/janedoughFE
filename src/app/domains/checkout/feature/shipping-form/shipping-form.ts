import { Component, inject, output, signal } from '@angular/core';
import { ViewPanel } from "@/src/app/shared/directives/view-panel";
import { MatIcon } from "@angular/material/icon";
import { MatFormField } from "@angular/material/form-field";
import { MatInput } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressService } from '../../data-access/address.service';
import { Toaster } from '@/src/app/core/notification/toaster.service';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'webapp-shipping-form',
  imports: [ViewPanel, MatIcon, MatFormField, MatInput, ReactiveFormsModule, MatButton],
  template: `
    <div webAppViewPanel> 
      <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
        <mat-icon>add_location</mat-icon>
        Create New Address
      </h2>

      <form [formGroup]="addressForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <mat-form-field> 
        <input matInput formControlName="firstName" type="text" placeholder="First Name" />
      </mat-form-field>
      <mat-form-field> 
        <input matInput formControlName="lastName" type="text" placeholder="Last Name" />
      </mat-form-field>
      <mat-form-field class="col-span-2"> 
        <input matInput formControlName="street" type="text" placeholder="Address" />
      </mat-form-field>
      <mat-form-field class="col-span-2"> 
        <input matInput formControlName="addressLine2" type="text" placeholder="Address 2" />
      </mat-form-field>
      <mat-form-field> 
        <input matInput formControlName="city" type="text" placeholder="City" />
      </mat-form-field>
      <mat-form-field> 
        <input matInput formControlName="state" type="text" placeholder="State" />
      </mat-form-field>
      <mat-form-field class="col-span-2"> 
        <input matInput formControlName="zip" type="text" placeholder="Zip" />
      </mat-form-field>
      
      <div class="col-span-2 flex justify-end gap-3 mt-2">
          <button matButton type="button" (click)="cancel.emit()">Cancel</button>
          <button matButton="filled" type="submit" [disabled]="isSubmitting()">
            {{ isSubmitting() ? 'Saving...' : 'Save Address' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: ``,
})
export class ShippingForm {
  fb = inject(FormBuilder);
  addressService = inject(AddressService);
  toaster = inject(Toaster);

  addressCreated = output<any>();
  cancel = output<void>();

  isSubmitting = signal(false);

  addressForm = this.fb.group({
    firstName: ['', Validators.required],
    middleName: [''],
    lastName: ['', Validators.required],
    street: ['', Validators.required],
    addressLine2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', Validators.required],
    country: ['USA', Validators.required], // Setting default to US
  });

  onSubmit() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    
    this.addressService.createAddress(this.addressForm.value as any).subscribe({
      next: (newAddress) => {
        this.toaster.success('Address added successfully!');
        this.isSubmitting.set(false);
        this.addressCreated.emit(newAddress);
      },
      error: (err) => {
        console.error('Failed to create address', err);
        this.toaster.error('Failed to save address.');
        this.isSubmitting.set(false);
      }
    });
  }

}
