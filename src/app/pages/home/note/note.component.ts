import {Component, Input, OnInit} from '@angular/core';
import Note from 'src/app/models/Note';
import {NotesService} from 'src/app/services/notes.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
})
export class NoteComponent implements OnInit {
  @Input() note!: Note;
  time: string = '';
  selectedNote!: Note;
  constructor(private noteService: NotesService) {
  }

  ngOnInit(): void {
    this.time = this.noteService
      .convertTimestampToMinutesAgo(Number(this.note.note_date))
      .toString();
    this.noteService.selectedNoteObservable.subscribe(
      (x) => (this.selectedNote = x)
    );
  }



  pin() {
    this.note.pinned = !this.note.pinned;
    this.noteService.saveNote(this.note);
  }

  delete() {
    this.noteService.deleteNote(this.note).then(r =>
      console.log(r));
  }
}
