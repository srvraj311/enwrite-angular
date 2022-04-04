import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { signOut, UserCredential, UserInfo } from 'firebase/auth';
import LoginReq from '../models/LoginReq';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userData: any; // Save logged in user data
  constructor(
    private authService: AngularFireAuth,
    private router: Router,
    public afs: AngularFirestore,
    public ngZone: NgZone
  ) {}

  // Sign in with email/password
  async loginUser(loginReq: LoginReq) {
    var email = loginReq.email;
    var password = loginReq.password;
    this.authService
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  isUserLoggedIn() {
    return this.authService.authState;
  }

  async logoutUser() {
    console.log('Logout Called');
    await this.authService.signOut();
    localStorage.removeItem('notes');
    localStorage.removeItem('user');
    console.log('Logout Processed');
    this.ngZone.run(() => {
      this.router.navigate(['/login']);
      console.log('Logout Complete');
    });
  }
  getCurrentEmail() {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user.email;
  }
  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.email}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    this.authService.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
    this.router.navigate(['/home']);
    return userRef.set(userData, {
      merge: true,
    });
  }
}
