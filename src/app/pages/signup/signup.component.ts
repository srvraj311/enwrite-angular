import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { finalize, Observable } from 'rxjs';
import LoginReq from 'src/app/models/LoginReq';
import { NotesService } from 'src/app/services/notes.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  selectedFile!: File;
  fb!: any;
  downloadURL!: Observable<string>;
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  name = new FormControl('', Validators.required);
  remeberDevice: FormControl = new FormControl(false);
  constructor(
    private userService: UserService,
    private notesService: NotesService,
    private storage: AngularFireStorage
  ) {}
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
  ngOnInit(): void {}
  login(form: NgForm) {
    var loginReq: LoginReq = {
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
  signup(form: NgForm) {}
  onFileSelected(event: any) {
    var n = Date.now();
    const file = event.target.files[0];
    const filePath = `profilepics/`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe((url) => {
            if (url) {
              this.fb = url;
            }
            console.log(this.fb);
          });
        })
      )
      .subscribe((url) => {
        if (url) {
          console.log(url);
        }
      });
  }
}
