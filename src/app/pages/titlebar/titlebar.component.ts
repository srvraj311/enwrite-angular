import { Component, OnInit } from '@angular/core';
import {UiService} from "../../services/ui.service";

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.css']
})
export class TitlebarComponent implements OnInit {
  navOpen!: boolean;
  isElectron:boolean = this.uiService.isElectron();
  constructor(private uiService : UiService) {
    this.uiService.navStatus.subscribe(b => this.navOpen = b)
  }
  ngOnInit(): void {

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
