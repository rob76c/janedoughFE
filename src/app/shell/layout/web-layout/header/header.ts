import { Component, inject } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar'
import { HeaderActions } from "../header-actions/header-actions";
import { ResponsiveManagerService } from '@/src/app/shared/util/responsive-manager.service';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'webapp-header',
  imports: [MatToolbar, HeaderActions, MatIcon],
  template: `
    <mat-toolbar class="w-full elevated py-2">
      <div class= "max-w-[1200px] mx-auto w-full flex items-center justify-between">
      <div class="flex items-center gap-2">
          <button matIconButton (click)="responsiveManager.toggleSideNav()">
            <mat-icon>menu</mat-icon>
          </button>
          <span>Jane Dough</span>
        </div>
      
      <webapp-header-actions/>
      </div>
    </mat-toolbar>
  `,
  host: {
    class: 'relative z-10 view-transition-name:header',
  },
  styles: ``,
})
export class Header {
  responsiveManager = inject(ResponsiveManagerService);
}
