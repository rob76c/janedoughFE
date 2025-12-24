import { Component, input } from '@angular/core';
import { MatButton } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-back-button',
  imports: [MatButton, RouterLink, MatIcon],
  template: `
    <button matButton="text" [routerLink]="navigateTo() ?? null" class="flex items-center gap-1">
      <mat-icon>arrow_back</mat-icon>
      <ng-content/>
    </button>
  `,
  styles: `
  :host {
    display: block;
  }
  `,
})
export class BackButton {
  navigateTo = input<string>();

}
