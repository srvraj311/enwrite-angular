import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'enWrite-angular';
  loggedIn: boolean = this.isUserLoggedIn();
  isUserLoggedIn(): boolean {
    return true;
  }
}
