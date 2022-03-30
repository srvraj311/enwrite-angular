import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { User, UserCredential, UserInfo } from 'firebase/auth';
import LoginReq from '../models/LoginReq';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private authService: AngularFireAuth, private router: Router) {}
  async loginUser(user: LoginReq): Promise<any> {
    // Login user on firebase
    const email = user.email;
    const password = user.password;
    try {
      const res = await this.authService.signInWithEmailAndPassword(
        email,
        password
      );
      localStorage.setItem('user', JSON.stringify(res.user));
      localStorage.setItem('loggedIn', 'true');
      this.router.navigate(['/home']);
      console.log('Logged In as ' + user.email);
    } catch (e) {
      localStorage.setItem('loggedIn', 'false');
      return this.onFailed(e);
    }
  }
  onFailed = function (err: any) {
    console.log(err);
    alert('Login Failed');
  };

  isUserLoggedIn(): boolean {
    return Boolean(localStorage.getItem('loggedIn'));
  }

  logoutUser() {
    this.authService.signOut();
    localStorage.removeItem('user');
    sessionStorage.clear();
  }

  getCurrentEmail(): string {
    //return this.user.
    return 'sourabhraj311@gmail.com';
  }
}
