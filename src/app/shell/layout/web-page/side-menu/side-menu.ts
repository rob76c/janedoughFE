import { TitleCasePipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { MatNavList, MatListItem } from '@angular/material/list';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'webapp-side-menu',
  imports: [MatNavList, MatListItem, TitleCasePipe, RouterLink],
  template: `
    <div class="p-6">
      <h2 class="text-lg text-gray-900">Welcome!!</h2>

      <mat-nav-list>
        @for (cat of categories(); track cat) {
        <mat-list-item
          [activated]="cat.id === category()"
          class="my-2"
          [routerLink]="['/products', cat.id]"
        >
          <span
            matListItemTitle
            class="font-medium"
            [class]="cat.id === category() ? 'text-white' : null"
          >
            {{ cat.label | titlecase }}
          </span>
        </mat-list-item>
        }
      </mat-nav-list>
    </div>
  `,
  styles: ``,
})
export class SideMenu {
  category = input<string>('all');
  categories = signal([
    { id: 'all', label: 'Home' },
    { id: '1', label: 'Order' },
    { id: '2', label: 'Coming Soon' },
  ]);
}
