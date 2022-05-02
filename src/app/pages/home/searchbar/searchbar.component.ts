import { Component, OnInit, OnChanges } from '@angular/core';
import {NotesService} from "../../../services/notes.service";

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {
  searchText: string = "";

  constructor(private notesService : NotesService) { }

  ngOnInit(): void {
    this.notesService.searchNotes(this.searchText);
  }

  search(){
    this.notesService.searchNotes(this.searchText);
  }
}
