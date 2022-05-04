import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { finalize, Observable } from 'rxjs';
import LoginReq from 'src/app/models/LoginReq';
import { NotesService } from 'src/app/services/notes.service';
import { UserService } from 'src/app/services/user.service';
import {Router} from "@angular/router";
import { ElectronService } from 'src/app/services/electron.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  selectedFile!: File;
  spinnerVisible: boolean = false;
  hide = true;
  downloadUrl:string = 'assets/pictures/user.png';
  signedUp:boolean = false;
  isEmailVerified:boolean = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  password2 = new FormControl('', [Validators.required ]);
  name = new FormControl('', Validators.required);
  constructor(
    private userService: UserService,
    private notesService: NotesService,
    private storage: AngularFireStorage,
    private router : Router,
    private electron : ElectronService
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
  ngOnInit(): void {
    console.log('Signup screen initiated')
  }
  login(form: NgForm) {
    this.router.navigate(['/login']).then(()=>{});
  }
  signup(form: NgForm) {
      this.spinnerVisible = true;
      const name = this.name.status == 'VALID' ? this.name.value : '';
      const email = this.email.status === 'VALID' ? this.email.value : null
      const password = this.password.status === 'VALID' ? this.password.value : null;
      const password2 = this.password2.status === 'VALID' ? this.password2.value : null;
      // TODO : Update is LoggedIn method
      if(name && email && password){
        this.userService.signUpUser(name , email, password).then(()=> {
          this.spinnerVisible = false;
            this.userService.isUserLoggedIn().subscribe((u) => {
              if(u?.email){
                this.signedUp = true;
                this.isEmailVerified = u.emailVerified;
              }
            })
        })
      }

  }

  completeSignup(){
    this.spinnerVisible = true;
    if(this.signedUp){
      this.userService.isUserLoggedIn().subscribe((u) => {
        if(u?.emailVerified){
          this.spinnerVisible = false;
          this.router.navigate(['/home']).then(()=> {
            console.log('Signup complete')
          })
        }
        else{
          window.alert('Email Not verified yet, Verify ASAP! ');
          this.spinnerVisible = false
          this.router.navigate(['/home']).then(()=> {
            console.log('Signup complete')
          })
        }
      })
    }
    this.spinnerVisible = false;
  }
  onFileSelected(event: any) {
    this.spinnerVisible = true;
    const n = Date.now();
    const file = event.target.files[0];
    const filePath = `profilepics/`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`profilepics/${n}`, file);
    task.then((a) =>{
        a.ref.getDownloadURL().then(url => {
          this.userService.updateProfilePhoto(url).then(() => {
            this.downloadUrl = url;
            this.spinnerVisible = false
          })
        });
    })
  }
  googleSignIn(){
    if(this.electron.isElectron){
      this.electron.showWaitingMessage();
      ElectronService.openUrlInBrowser('https://enwrite-8ffba.web.app/redirect');
      return
    }
    this.userService.googleAuth().then( (r) => 'Google Auth : Login Component')
  }
}
