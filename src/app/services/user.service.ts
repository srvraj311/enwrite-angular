import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  loginUser(user: Object): void {
    // Login user on firebase
    console.log(user);
  }
}
