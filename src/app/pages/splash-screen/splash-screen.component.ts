import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css'],
})
export class SplashScreenComponent implements OnInit {
  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    setTimeout(() => this.isUserLoggedIn(), 2000);
  }

  isUserLoggedIn(): void {
    this.userService.isUserLoggedIn().subscribe((x) => {
      if (x !== null) {
        this.router.navigateByUrl('/home');
      } else {
        this.router.navigateByUrl('/login');
      }
    });
  }
}
