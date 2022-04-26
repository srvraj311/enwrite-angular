import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotesService } from 'src/app/services/notes.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userService.isUserLoggedIn().subscribe((x) => {
      if (x !== null) {
        console.log('HOME : Checking user login and retriving note');
      } else {
        this.router.navigate(['/login']).then(() => {console.log('Router : Home to Login')})
      }
    });
  }
}
