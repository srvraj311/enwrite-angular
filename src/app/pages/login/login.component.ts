import {Component, OnInit} from '@angular/core';
import {NgForm, ValidationErrors} from '@angular/forms';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import {UserService} from 'src/app/services/user.service';
import {Router} from '@angular/router';
import LoginReq from '../../models/LoginReq';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  hide = true;
  spinnerVisible: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.userService.isUserLoggedIn().subscribe((user) => {
      if (user) {
        if (user.email !== null && user.emailVerified) {
          this.router.navigate(['/home']);
        }
      }
    });
  }

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  remeberDevice: FormControl = new FormControl(false);

  getErrorMessage(f: FormControl) {
    if (f.hasError('required')) {
      return 'You must enter a value';
    }
    if (f.hasError('email')) {
      return 'Not a valid email';
    }
    if (f.hasError('password')) {
      return 'Not a strong password, try harder password';
    }
    return '';
  }

  async login(form: NgForm) {
    this.spinnerVisible = true;
    const loginReq: LoginReq = {
      email: this.email.status === 'VALID' ? this.email.value : null,
      password: this.password.status === 'VALID' ? this.password.value : null,
      rememberDevice: this.remeberDevice.value,
    };

    if (loginReq.email != null && loginReq.password != null) {
      await this.userService.loginUser(loginReq)
        .then((user) => {
          this.router.navigate(['/home']).then(_ => this.spinnerVisible = false)
        }).catch((e) => {
          console.log('Login Error ' + e);
          this.spinnerVisible = false
        })
    } else {
      this.spinnerVisible = false;
      if (loginReq.password == null) {
        this.password.hasError('password') ? this.password.setValue('Not a valid password') : console.log();
      } else if (loginReq.email == null) {
        this.email.hasError('email') ? this.password.setValue('Not a valid password') : console.log();
      }
    }
  }

  openDialog(title: string, message: string): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '250px',
      height: '200px',

      data: {title: title, message: message},
    });
  }

  signup(form: NgForm): void {
    this.router.navigate(['/signup']).then(r => console.log('Signup Page Loaded'))
  }
}
