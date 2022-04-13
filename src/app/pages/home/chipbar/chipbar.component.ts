import { Component, OnInit } from '@angular/core';
import {
  MatChipInputEvent,
  MatChipSelectionChange,
} from '@angular/material/chips';
import { NotesService } from 'src/app/services/notes.service';

@Component({
  selector: 'app-chipbar',
  templateUrl: './chipbar.component.html',
  styleUrls: ['./chipbar.component.css'],
})
export class ChipbarComponent implements OnInit {
  constructor(private notesService: NotesService) {}

  ngOnInit = (): void => {};
  update(type: string) {
    this.notesService.setNoteFilter(type);
  }
}
