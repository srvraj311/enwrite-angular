import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import Note from 'src/app/models/Note';
import { NotesService } from 'src/app/services/notes.service';

@Component({
  selector: 'app-notes-container',
  templateUrl: './notes-container.component.html',
  styleUrls: ['./notes-container.component.css'],
})
export class NotesContainerComponent implements OnInit {
  notesArr!: Note[];
  selectedNote!: Note;
  constructor(private noteService: NotesService, private db: Firestore) {}

  ngOnInit(): void {
    if (localStorage.getItem('notes') !== null) {
      //localStorage.removeItem('notes');

      var obj = localStorage.getItem('notes');
      this.notesArr = JSON.parse(obj!.toString());
    } else {
      this.noteService.notesObservable.subscribe((data) => {
        // Fetching from observable
        this.notesArr = data as Note[];
      });
    }
  }

  selectNote(i: number): void {
    this.selectedNote = this.notesArr[i];
  }
}
