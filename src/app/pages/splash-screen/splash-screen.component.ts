import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css'],
})
export class SplashScreenComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => this.isUserLoggedIn(), 2000);
  }

  isUserLoggedIn(): void {
    var loggedIn = false;
    if (loggedIn) {
      this.router.navigateByUrl('/login');
    } else {
      this.router.navigateByUrl('/home');
    }
  }
}
