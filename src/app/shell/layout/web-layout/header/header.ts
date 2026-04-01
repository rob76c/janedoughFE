import { Component, inject } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar'
import { HeaderActions } from "../header-actions/header-actions";
import { ResponsiveManagerService } from '@/src/app/shared/util/responsive-manager.service';
import { MatIcon } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";

@Component({
  selector: 'webapp-header',
  imports: [MatToolbar, HeaderActions, MatIcon, MatTooltip],
  template: `
    <mat-toolbar class="w-full elevated py-2">
      <div class= "w-full px-6 flex items-center justify-between">
      <div class="flex items-center gap-2">
          <button matIconButton matTooltip="MENU!" (click)="responsiveManager.toggleSideNav()">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="text-2xl">Carrera Classics</span>
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
