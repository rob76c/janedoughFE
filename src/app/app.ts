import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./shell/layout/web-layout/header/header";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  template: `
    
    <webapp-header class ="z-10 relative"/>
    <div class="h-[calc(100%-64px)] overflow-auto">
    <router-outlet />
    </div>
  `,
  styles: [],
})
export class App {}
