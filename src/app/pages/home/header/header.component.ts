import { Component, OnInit } from '@angular/core';
import {UiService} from "../../../services/ui.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  navOpen!: boolean;
  isElectron:boolean = this.uiService.isElectron();
  constructor(private uiService : UiService) {
    this.uiService.navStatus.subscribe(b => this.navOpen = b)
  }

  ngOnInit(): void {

  }

  toggleNav(){
    this.uiService.navOpen.next(!this.navOpen);
  }
  close(){
    this.uiService.close();
  }
  minimise(){
    this.uiService.minimise();
  }
  maximise(){
    this.uiService.maximise();
  }
}
