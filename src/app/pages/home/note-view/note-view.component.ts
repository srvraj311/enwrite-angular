import {Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import Note from 'src/app/models/Note';
import { NotesService } from 'src/app/services/notes.service';
import {UiService} from "../../../services/ui.service";

@Component({
  selector: 'app-note-view',
  templateUrl: './note-view.component.html',
  styleUrls: ['./note-view.component.css'],
})
export class NoteViewComponent implements OnInit {
  selectedNote!: Note;
  time!: string;
  title!: string;
  body!: string;
  @ViewChild('#bodyInput') bodyElement:ElementRef = new ElementRef<any>('textarea');
  colorArray: string[] = [
    '#FFFFFF',
    '#ACACAC',
    '#FFF171',
    '#e090d3',
    '#2fc9da',
    '#ff7f7f',
    '#519F54',
    '#aa90e0',
  ];
  selectedColor: string = '#FFFFFF';

  constructor(private notesService: NotesService, private uiService : UiService) {
    notesService.selectedNoteObservable.subscribe((n) => {
      this.selectedNote = n;
      this.time = notesService.convertTimestampToMinutesAgo(
        Number(n.note_date)
      ) as string;
      this.title = n.note_title;
      this.body = n.note_body;
      this.selectedColor = n.note_colour;
    });
  }
  ngOnInit(): void {

  }
  saveNote() {
    const date: string = String(+new Date());
    const note: Note = new Note(
      this.selectedNote.note_id,
      this.title,
      this.body,
      date,
      this.selectedColor,
      false
    );
    this.notesService.saveNote(note);
    if (this.selectedNote.note_id == 'new') {
      this.selectedNote = new Note(
        'empty',
        '',
        '',
        '',
        this.selectedColor,
        false
      );
    }
  }

  addNewNote() {
    const date: string = String(+Date.now());
    const tempNote: Note = new Note(
      'new',
      'New Note',
      '',
      date,
      '#FFFFFF',
      false
    );
    this.notesService.updateSelectedNote(tempNote);
  }

  updateColor(color: string) {
    this.selectedColor = color;
  }

  clearInput() {
    this.title = ""
    this.body = ""
  }

}
