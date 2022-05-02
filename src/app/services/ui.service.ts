import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UiService {
  navOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  navStatus = this.navOpen.asObservable();
  constructor() { }
}
