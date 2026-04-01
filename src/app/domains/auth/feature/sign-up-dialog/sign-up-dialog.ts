import { Component, inject, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatAnchor, MatButton, MatIconButton } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialog, MatDialogClose, MatDialogRef } from "@angular/material/dialog";
import { MatError, MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from "@angular/material/icon";
import { MatInput } from '@angular/material/input';
import { CatalogStore } from '../../../catalog/data-access/catalog.store';
import { SignUpParams } from '../../model/user';
import { SignInDialog } from '../sign-in-dialog/sign-in-dialog';
import { AuthStore } from '../../data-access/auth.store';


export const matchPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) return null;

  if (password.value !== confirmPassword.value) {
    // Set error on confirmPassword control directly so MatFormField picks it up
    confirmPassword.setErrors({ ...confirmPassword.errors, passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    // Clear the passwordMismatch error if they match, preserving any other errors (like 'required')
    if (confirmPassword.hasError('passwordMismatch')) {
      const errors = { ...confirmPassword.errors };
      delete errors['passwordMismatch'];
      confirmPassword.setErrors(Object.keys(errors).length > 0 ? errors : null);
    }
    return null;
  }
};


@Component({
  selector: 'app-sign-up-dialog',
  imports: [MatIconButton, MatDialogClose, MatIcon, MatDialogClose, MatFormField, MatInput, MatPrefix, MatAnchor, MatButton, ReactiveFormsModule, MatError],
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
    @if (errorMessage()) {
        <div class="flex items-start p-3 mb-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {{ errorMessage() }}
        </div>
      }
      <mat-form-field class="mb-4"> 
        <input formControlName="firstName" matInput type="text" placeholder="Enter your first name" />
        <mat-icon matPrefix>person</mat-icon>
      </mat-form-field>
      <mat-form-field class="mb-4"> 
        <input formControlName="middleName" matInput type="text" placeholder="Enter your middle name" />
        <mat-icon matPrefix>person</mat-icon>
      </mat-form-field>
      <mat-form-field class="mb-4"> 
        <input formControlName="lastName" matInput type="text" placeholder="Enter your last name" />
        <mat-icon matPrefix>person</mat-icon>
      </mat-form-field>
      <mat-form-field class="mb-4"> 
      <input formControlName="username" matInput type="text" placeholder="Enter your username" />
        <mat-icon matPrefix>person</mat-icon>

        @if (signUpForm.controls.username.hasError('pattern')) {
          <mat-error class="text-xs leading-tight">
            Username can only contain letters, numbers, dots, underscores, and dashes.
          </mat-error>
        } @else if (signUpForm.controls.username.hasError('minlength')) {
          <mat-error>Username must be at least 2 characters long.</mat-error>
        } @else if (signUpForm.controls.username.hasError('required')) {
          <mat-error>Username is required.</mat-error>
        }

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
      <input matInput formControlName="password" type="password" placeholder="Enter your super secret password" />
        <mat-icon matPrefix>lock</mat-icon>
        @if (signUpForm.controls.password.hasError('pattern')) {
          <mat-error class="text-xs leading-tight">
            Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number
          </mat-error>
        } @else if (signUpForm.controls.password.hasError('required')) {
          <mat-error>Password is required.</mat-error>
        }
      </mat-form-field>

      <mat-form-field class="mb-4"> 
      <input matInput formControlName="confirmPassword" type="password" placeholder="Confirm your password" />
        <mat-icon matPrefix>lock</mat-icon>
        @if (signUpForm.controls.confirmPassword.hasError('passwordMismatch')) {
          <mat-error>Passwords do not match.</mat-error>
        } @else if (signUpForm.controls.confirmPassword.hasError('required')) {
          <mat-error>Please confirm your password.</mat-error>
        }
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
  store = inject(AuthStore);
  dialogRef = inject(MatDialogRef)
  matDialog = inject(MatDialog)

  data = inject<{checkout: boolean}>(MAT_DIALOG_DATA);

  errorMessage = signal<string | null>(null);

  signUpForm = this.fb.group({
    firstName: ['Jane', Validators.required],
    middleName: ['Cookie', Validators.required],
    lastName: ['Dough', Validators.required],
    username: ['cookiemonster', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[a-zA-Z0-9._-]+$/)
    ]],
    email: ['janed@test.com', Validators.required],
    phoneNumber: ['2016268778', Validators.required],
    password: ['Secret123', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    ]],
    confirmPassword: ['Secret123', Validators.required],
  }, { validators: matchPasswordValidator });

  async signUp() {
    if(!this.signUpForm.valid) {
      this.signUpForm.markAllAsTouched();
      return;
    }
    this.errorMessage.set(null);
    const {firstName, middleName, lastName, username, email, phoneNumber, password} = this.signUpForm.value;
    const result = await this.store.signUp({firstName, middleName, lastName, username, email, phoneNumber, password, dialogId: this.dialogRef.id, checkout: this.data?.checkout} as SignUpParams);
    if (result && !result.success && result.error) {
      this.errorMessage.set(result.error);
    }
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
