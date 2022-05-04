import { Component, OnInit } from '@angular/core';
import {UiService} from "../../services/ui.service";

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.css']
})
export class TitlebarComponent implements OnInit {
  isElectron:boolean = this.uiService.isElectron();
  constructor(private uiService : UiService) {
    this.isElectron = this.uiService.isElectron();
  }
  ngOnInit(): void {

  }
  close(){
    console.log("CLose Button Clicked");
    this.uiService.close();
  }
  minimise(){
    console.log("Minimise Button Clicked");
    this.uiService.minimise();
  }
  maximise(){
    console.log("Maximise Button Clicked");
    this.uiService.maximise();
  }
}
