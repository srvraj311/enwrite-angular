import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { getMatIconFailedToSanitizeLiteralError } from '@angular/material/icon';
import { collection } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import Note from 'src/app/models/Note';
import { NotesService } from 'src/app/services/notes.service';
import {UiService} from "../../../services/ui.service";

@Component({
  selector: 'app-notes-container',
  templateUrl: './notes-container.component.html',
  styleUrls: ['./notes-container.component.css'],
})
export class NotesContainerComponent implements OnInit {
  notesArr!: Note[];
  selectedNote!: Note;
  navOpen!: boolean;
  constructor(private noteService: NotesService, private uiService : UiService) {
    this.uiService.navStatus.subscribe(b => this.navOpen = b)
  }

  ngOnInit(): void {
    this.noteService.getNotes().then(r => console.log('Notes Fetched'));
    this.noteService.selectedNoteObservable.subscribe((n) => {
      this.selectedNote = n;
    });
    this.noteService.notesObservable.subscribe((data) => {
      this.filterNotes(data as Note[]);
    });
  }

  filterNotes(notes: Note[]) {
    this.noteService.notesFilterObservable.subscribe((s) => {
      if (s === 'none') {
        this.notesArr = notes;
      } else if (s === 'pin') {
        this.notesArr = [];
        for (let x of notes) {
          if (x.pinned) {
            this.notesArr.push(x);
          }
        }
      }
    });
  }

  selectNote(n: Note): void {
    const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if(this.uiService.isMobile || width < 560){
      this.uiService.navOpen.next(!this.uiService.navOpen.value);
    }
    this.noteService.updateSelectedNote(n);
  }

}
