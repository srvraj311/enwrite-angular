import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import LoginReq from '../models/LoginReq';
import {
  MatDialog,
} from '@angular/material/dialog';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { User } from '../models/User';
import { CustomMessageDialog } from '../UiComponets/CustomMessageDialog';
import { FirebaseError } from 'firebase/app';
import {rejects} from "assert";
import {signInWithEmailAndPassword} from "@angular/fire/auth";

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
    const email = loginReq.email;
    const password = loginReq.password;
    return this.authService
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user).then();
        return Promise.resolve();
      })
      .catch((error) => {
        this.processError(error);
        return Promise.reject('Error in Login');
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
      case 'auth/email-already-in-use':
        this.ngZone.run(() => {
          this.openDialog(
            'Email Already in Use',
            'Provided email is already being used by another account, Please try with different email or login'
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
    // this.authService.getRedirectResult().then((u) => {
    //   console.log(u.user);
    // })
    return this.authService.authState;
  }

  async logoutUser() {
    return this.authService.signOut().then(() => {
      console.log('Logout Complete');
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/login']);
      this.authService.signOut();
    }).catch((err) => {
      console.log(err)
    })
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
        this.userData = user
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
    return userRef.set(userData, {
      merge: true,
    });
  }

  async signUpUser(name: any, email: any, password: any) {
    console.log('Signup called');
      this.authService.signOut().then(async () => {
        await localStorage.clear();
      })
      return this.authService.createUserWithEmailAndPassword(email, password)
        .then((user) => {
           this.SendVerificationMail()
           this.SetUserData(user.user);
        }).then(() => {
          return this.authService.currentUser.then((u) => u?.updateProfile({
             displayName: name,
             photoURL: 'https://res.cloudinary.com/srvraj311/image/upload/v1649646022/pp_t4m8ym.jpg'
        }))
      })
        .catch((e) => {
          console.log('Error')
          this.processError(e);
        })
  }

  async updateProfilePhoto(url : string){
    return this.authService.currentUser.then((u) => {
      u?.updateProfile({photoURL : url })
    })
  }

  SendVerificationMail() {
    return this.authService.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        console.log('User verification mail sent');
      });
  }
}
