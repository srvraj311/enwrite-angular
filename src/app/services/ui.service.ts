import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {DeviceDetectorService} from 'ngx-device-detector';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  navOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isMobile: boolean = this.deviceService.isMobile();
  isTablet: boolean = this.deviceService.isTablet();
  navStatus = this.navOpen.asObservable();

  constructor(private deviceService: DeviceDetectorService) {

  }
}
