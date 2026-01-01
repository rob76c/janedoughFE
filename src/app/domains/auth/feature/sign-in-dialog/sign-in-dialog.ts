import { Component, inject, signal } from '@angular/core';
import { MatIconButton, MatAnchor, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatSuffix, MatPrefix  } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialog, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { SignInParams } from '../../model/user';
import { CatalogStore } from '../../../catalog/data-access/catalog.store';
import { SignUpDialog } from '../sign-up-dialog/sign-up-dialog';

@Component({
  selector: 'app-sign-in-dialog',
  imports: [MatIconButton, MatIcon, MatDialogClose, MatFormField, MatInput, MatSuffix, MatPrefix, MatAnchor, MatButton, ReactiveFormsModule],
  template: `
    <div class="p-8 max-w-[400px] dlex flex-col">
      <div class="flex justify-between">
        <div>
          <h2 class="text-xl font-medium mb-1">Sign In</h2>
          <p class="text-sm text-gray-500">Sign in to your account to continue shopping</p>
        </div>
        <button tabindex="-1" matIconButton class="-mt-2 -mr-2" mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <form class="mt-6" [formGroup]="signInForm" (ngSubmit)="signIn()"> 
        <mat-form-field class="w-full mb-4"> 
          <input matInput formControlName="email" type="email" placeholder="Enter your email" />
          <mat-icon matPrefix>email</mat-icon>
        </mat-form-field>
        <mat-form-field class="w-full mb-6"> 
          <input
          matInput
          formControlName="password"
          [type]="passwordVisible() ? 'text': 'password'"
          placeholder="Enter your password" 
          />
          <mat-icon matPrefix>lock</mat-icon>
          <button
          matSuffix
          matIconButton
          type="button"
          class="mr-2"
          (click)="passwordVisible.set(!passwordVisible())"
          >
            <mat-icon [fontIcon]="passwordVisible() ? 'visibility_off': 'visibility'"> </mat-icon>
          </button>
        </mat-form-field>
        <button type="submit" matButton="filled" class="w-full">Sign In </button>
      </form>

      <p class="text-sm text-gray-500 mt-2 text-center">
        Don't have an account?
       <a class="text-blue-600 cursor-pointer" (click)="openSignUpDialog()">Sign up</a>
      </p>
    </div>
  `,
  styles: ``,
})
export class SignInDialog {
  fb = inject(NonNullableFormBuilder);
  store = inject(CatalogStore);
  data = inject<{checkout:boolean}>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef);
  matDialog = inject(MatDialog);


  passwordVisible = signal(false);

  signInForm = this.fb.group({
    email: ['johndoe@test.com', Validators.required],
    password: ['secret123', Validators.required]
  });

  signIn() {
    if(!this.signInForm.valid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    const {email, password} = this.signInForm.value;
    this.store.signIn({email, password, checkout: this.data?.checkout, dialogId: this.dialogRef.id } as SignInParams);
  }
  openSignUpDialog() {
    this.dialogRef.close();
    this.matDialog.open(SignUpDialog, {
      disableClose: true,
      data: {
        checkout: this.data?.checkout,
      },
    });
  }
}
