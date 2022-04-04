import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import Note from 'src/app/models/Note';
import { NotesService } from 'src/app/services/notes.service';

@Component({
  selector: 'app-note-view',
  templateUrl: './note-view.component.html',
  styleUrls: ['./note-view.component.css'],
})
export class NoteViewComponent implements OnInit {
  selectedNote!: Note;
  NO_NOTES_SELECTED: string = 'Create a new Note or select a note to view or ';
  constructor(private notesService: NotesService) {
    notesService.selectedNoteObservable.subscribe(
      (n) => (this.selectedNote = n)
    );
  }
  ngOnInit(): void {}
}
