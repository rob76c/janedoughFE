import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { ViewPanel } from "@/src/app/shared/directives/view-panel";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio"
@Component({
  selector: 'webapp-payment-form',
  imports: [MatIcon, ViewPanel, MatRadioButton, MatRadioGroup],
  template: `
    <div webAppViewPanel> 
      <h2 class="text-2xl font-bold mb-6 flex items-center gap-2"> 
      <mat-icon>payment</mat-icon>
      Payment Options
      </h2>
      <div> 
        <mat-radio-group [value]="'stripe'"> 
          <mat-radio-button value="stripe"> 
            <img src="assets/imgs/stripe-logo.png" alt="Stripe" class="h-6" />
          </mat-radio-button>
        </mat-radio-group>
      </div>
    </div>
  `,
  styles: ``,
})
export class PaymentForm {

}
