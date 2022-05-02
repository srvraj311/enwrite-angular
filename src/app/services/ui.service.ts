import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {DeviceDetectorService} from 'ngx-device-detector';
import {MatSnackBar} from "@angular/material/snack-bar";
import {ElectronService} from "./electron.service";



@Injectable({
  providedIn: 'root'
})

export class UiService {
  navOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isMobile: boolean = this.deviceService.isMobile();
  isTablet: boolean = this.deviceService.isTablet();
  navStatus = this.navOpen.asObservable();

  constructor(private deviceService: DeviceDetectorService,private electron : ElectronService,  private snackbar : MatSnackBar) {

  }

  showMessage(message : string) {
    this.snackbar.open(message)._dismissAfter(1000);
  }

  isElectron(){
    if (this.electron.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      return true;
    } else {
      console.log('Run in browser');
      return false;
    }
  }
  close(){
    this.electron.close();
  }
  minimise(){
    this.electron.minimise();
  }
  maximise(){
    this.electron.maximise();
  }

}
