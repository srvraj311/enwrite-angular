import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  hide = true;
  constructor(private userService: UserService) {}

  ngOnInit(): void {}

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

  login(form: NgForm): void {
    var loginReq = {
      email: this.email.status === 'VALID' ? this.email.value : null,
      password: this.password.status === 'VALID' ? this.password.value : null,
      remeberDevice: this.remeberDevice.value,
    };
    if (loginReq.email != null && loginReq.password != null) {
      this.userService.loginUser(loginReq);
    } else {
      if (loginReq.password == null) {
        this.password.hasError('password') ? 'Not a valid password' : '';
      } else if (loginReq.email == null) {
        this.email.hasError('emial') ? 'Not a valid password' : '';
      }
    }
  }
}
