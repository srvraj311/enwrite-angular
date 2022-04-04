import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { signOut, UserCredential, UserInfo } from 'firebase/auth';
import LoginReq from '../models/LoginReq';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { User } from '../models/User';
import { LoginComponent } from '../pages/login/login.component';
import { AppComponent } from '../app.component';
import { CustomMessageDialog } from '../UiComponets/CustomMessageDialog';
import { FirebaseError } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userData: any; // Save logged in user data
  constructor(
    private authService: AngularFireAuth,
    private router: Router,
    public afs: AngularFirestore,
    public ngZone: NgZone,
    private dialog: MatDialog
  ) {}

  // Sign in with email/password
  loginUser(loginReq: LoginReq) {
    var email = loginReq.email;
    var password = loginReq.password;
    return this.authService
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log();
        this.SetUserData(result.user);
      })
      .catch((error) => {
        this.processError(error);
        // Process Erros here
      });
  }
  processError(error: FirebaseError) {
    switch (error.code) {
      case 'auth/user-not-found':
        this.ngZone.run(() => {
          this.openDialog(
            'Invalid User',
            'No user found with provide demail-id'
          );
        });
        break;
      case 'auth/wrong-password':
        this.ngZone.run(() => {
          this.openDialog(
            'Wrong Credentials ',
            'Provided credentials is incorrect, Please try again'
          );
        });
        break;
      default:
        this.ngZone.run(() => {
          this.openDialog(
            ' Network Error ',
            ' Error logging in: \n ' + error.code
          );
        });
    }
  }
  openDialog(title: string, message: string): void {
    const dialogRef = this.dialog.open(CustomMessageDialog, {
      width: '250px',
      hasBackdrop: true,
      autoFocus: true,
      data: { title: title, message: message },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
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
