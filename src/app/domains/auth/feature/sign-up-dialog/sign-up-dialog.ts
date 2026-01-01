import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAnchor, MatButton, MatIconButton } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialog, MatDialogClose, MatDialogRef } from "@angular/material/dialog";
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from "@angular/material/icon";
import { MatInput } from '@angular/material/input';
import { CatalogStore } from '../../../catalog/data-access/catalog.store';
import { SignUpParams } from '../../model/user';
import { SignInDialog } from '../sign-in-dialog/sign-in-dialog';

@Component({
  selector: 'app-sign-up-dialog',
  imports: [MatIconButton, MatDialogClose, MatIcon, MatDialogClose, MatFormField, MatInput, MatPrefix, MatAnchor, MatButton, ReactiveFormsModule],
  template: `
    <div class="p-8 min-w-[400px] flex flex-col">
    <div class="flex justify-between"> 
      <div> 
        <h2 class="text-xl font-medium mb-1"> Sign Up </h2>
        <p class="text-sm text-gray-500">Stop salvating and get one today! </p>
      </div>
      <button tabindex="-1" matIconButton class="-mt-2 -mr-2" mat-dialog-close>
        <mat-icon>close</mat-icon>
        </button>
    </div>  
    <form [formGroup]="signUpForm" class="mt-6 flex flex-col" (ngSubmit)="signUp()">
      <mat-form-field class="mb-4"> 
        <input formControlName="name" matInput type="text" placeholder="Enter your name" />
        <mat-icon matPrefix>person</mat-icon>
      </mat-form-field>
      <mat-form-field class="mb-4"> 
      <input formControlName="username" matInput type="text" placeholder="Enter your username" />
        <mat-icon matPrefix>person</mat-icon>
      </mat-form-field>
      <mat-form-field class="mb-4"> 
      <input matInput formControlName="email" type="text" placeholder="Enter your email" />
        <mat-icon matPrefix>email</mat-icon>
      </mat-form-field>
      <mat-form-field class="mb-4"> 
      <input matInput formControlName="phoneNumber" type="text" placeholder="Enter your phone number" />
        <mat-icon matPrefix>phone</mat-icon>
      </mat-form-field>
      <mat-form-field class="mb-4"> 
      <input matInput formControlName="password" type="text" placeholder="Enter your super secret password" />
        <mat-icon matPrefix>lock</mat-icon>
      </mat-form-field>
      <mat-form-field class="mb-4"> 
      <input matInput formControlName="confirmPassword" type="text" placeholder="Confirm your password" />
        <mat-icon matPrefix>lock</mat-icon>
      </mat-form-field>

      <button type="submit" matButton="filled" class="w-full">
        <!-- {{store.loading() ? 'Creating Account...' : 'Create Account'}} -->
         Create Account
      </button>
  </form>
  <p class="text-sm text-gray-500 mt-2 text-center">
        Already have an account?
       <a class="text-blue-600 cursor-pointer" (click)="openSignInDialog()">Sign In</a>
      </p>
  </div>
  `,
  styles: ``,
})
export class SignUpDialog {

  fb = inject(NonNullableFormBuilder);
  store = inject(CatalogStore);
  dialogRef = inject(MatDialogRef)
  matDialog = inject(MatDialog)

  data = inject<{checkout: boolean}>(MAT_DIALOG_DATA);

  signUpForm = this.fb.group({
    name: ['Jane Dough', Validators.required],
    username: ['cookiemonster', Validators.required],
    email: ['janed@test.com', Validators.required],
    phoneNumber: ['2016268778', Validators.required],
    password: ['secret123', Validators.required],
    confirmPassword: ['secret123', Validators.required],
  });

  signUp() {
    if(!this.signUpForm.valid) {
      this.signUpForm.markAllAsTouched();
      return;
    }
    const {name, username, email, phoneNumber, password} = this.signUpForm.value;
    this.store.signUp({name, username, email, phoneNumber, password, dialogId: this.dialogRef.id, checkout: this.data?.checkout} as SignUpParams)
  }

  openSignInDialog() {
    this.dialogRef.close();
    this.matDialog.open(SignInDialog, {
      disableClose: true,
      data: {
        checkout: this.data?.checkout,
      }
    })
  }
}
