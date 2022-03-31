import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import Note from 'src/app/models/Note';

@Component({
  selector: 'app-note-view',
  templateUrl: './note-view.component.html',
  styleUrls: ['./note-view.component.css'],
})
export class NoteViewComponent implements OnInit {
  @Input() selectedNote!: Note;
  NO_NOTES_SELECTED: string = 'Create a new Note or select a note to view or ';
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (!changes['selectedNote'].firstChange) {
      this.selectedNote = changes['selectedNote'].currentValue;
    }
  }
}
