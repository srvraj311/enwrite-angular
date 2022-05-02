import {Injectable} from '@angular/core';
import Note from '../models/Note';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserService} from './user.service';
import {Router} from '@angular/router';
import {v4 as uuidv4} from 'uuid';
import {ref} from "@angular/fire/storage";
import {UiService} from "./ui.service";


const CONSTANT_NOTES_REF: string = 'note';
const CONSTANT_USER_RED: string = 'users';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  notesArr: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);
  //binArr: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);
  notesObservable: Observable<Note[]> = this.notesArr.asObservable();
  notesFilter: BehaviorSubject<string> = new BehaviorSubject<string>('none');
  notesFilterObservable = this.notesFilter.asObservable();
  selectedNote: BehaviorSubject<Note> = new BehaviorSubject<Note>(
    new Note('empty', 'Title', 'New Note', '', '#FFFFFF', false)
  );
  selectedNoteObservable = this.selectedNote.asObservable();

  constructor(
    private firestore: AngularFirestore,
    private userService: UserService,
    private router: Router,
    private uiService: UiService
  ) {
  }

  setNoteFilter(s: string) {
    this.notesFilter.next(s);
  }

  updateSelectedNote(note: Note) {
    this.selectedNote.next(note);
  }

  clearSelectedNote() {
    this.updateSelectedNote(new Note(
      'empty',
      '',
      '',
      '',
      '#FFFFFF',
      false
    ));
  }

  searchNotes(searchText: string) {
    this.userService.isUserLoggedIn().subscribe((user) => {
      if (user !== null) {
        const email = user.email;
        const userRef: AngularFirestoreDocument<any> = this.firestore.doc(
          `users/${email}`
        );
        userRef
          .collection(CONSTANT_NOTES_REF)
          .valueChanges().subscribe(n => {
          n = n as Note[]
          let filteredNote: Note[] = [];
          for (let note of n) {
            if (note['note_title'].toLowerCase().includes(searchText.toLowerCase()) || note['note_body'].toLowerCase().includes(searchText.toLowerCase())) {
              filteredNote.push(note as Note);
            }
          }
          this.updateNotesObservable(filteredNote);
        })
      }
    });
  }

  // Update the notes Observable to contain the latest changes
  updateNotesObservable(notes: Note[]) {
    this.notesArr.next(notes);
  }

  // get notes from firebase
  async getNotes(): Promise<void> {
    this.userService.isUserLoggedIn().subscribe((user) => {
      if (user !== null) {
        const email = user.email;
        const userRef: AngularFirestoreDocument<any> = this.firestore.doc(
          `users/${email}`
        );
        userRef
          .collection(CONSTANT_NOTES_REF)
          .valueChanges()
          .subscribe((notes) => {
            this.updateNotesObservable(<Note[]>notes);
          });
      }
      console.log('Notes Refreshed');
    });
  }

  saveNote(note: Note) {
    this.userService.isUserLoggedIn().subscribe((user) => {
      if (user !== null) {
        const email = user.email;
        const userRef: AngularFirestoreDocument<any> = this.firestore.doc(
          `users/${email}`
        );
        if (note.note_id == 'new') {
          note.note_id = uuidv4();
        }
        userRef
          .collection(CONSTANT_NOTES_REF)
          .doc(note.note_id)
          .set(Object.assign({}, note)).then(_ => this.uiService.showMessage('Note Saved')).catch( _ => this.uiService.showMessage('Failed to Save Note'))
      }
    });
  }


  convertTimestampToMinutesAgo(time: number) {
    switch (typeof time) {
      case 'number':
        break;
      case 'string':
        time = +new Date(time);
        break;
      default:
        time = +new Date();
    }
    const time_formats = [
      [60, 'seconds', 1], // 60
      [120, '1 minute ago', '1 minute from now'], // 60*2
      [3600, 'minutes', 60], // 60*60, 60
      [7200, '1 hour ago', '1 hour from now'], // 60*60*2
      [86400, 'hours', 3600], // 60*60*24, 60*60
      [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
      [604800, 'days', 86400], // 60*60*24*7, 60*60*24
      [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
      [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
      [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
      [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
      [58060800000, 'centuries', 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    let seconds = (+new Date() - time) / 1000,
      token = 'ago',
      list_choice = 1;

    if (seconds == 0) {
      return 'Just now';
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = 'from now';
      list_choice = 2;
    }
    let i = 0,
      format;
    while ((format = time_formats[i++]))
      if (seconds < format[0]) {
        if (typeof format[2] == 'string') return format[list_choice];
        else
          return (
            Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token
          );
      }
    return time;
  }

  filterNotes(sortBy: string) {
    this.notesObservable.subscribe((n) => {
      n = n as Note[];
      if (sortBy === 'time') {
        n = n.sort((a, b) => {
          return Number(b.note_date) - Number(a.note_date);
        });
      } else if (sortBy === 'title') {
        n = n.sort((a, b) => {
          return a.note_title.localeCompare(b.note_title);
        });
      } else if (sortBy === 'color') {
        n = n.sort((a, b) => {
          return a.note_colour.localeCompare(b.note_colour);
        });
      } else {
        n = n.sort((a, b) => {
          return Number(b.note_date) - Number(a.note_date);
        });
      }
    });
  }

  async deleteNote(note: Note) {
    this.userService.isUserLoggedIn().subscribe((user) => {
      if (user !== null) {
        const email = user.email;
        const userRef: AngularFirestoreDocument<any> = this.firestore.doc(
          `users/${email}`
        );
        userRef
          .collection(CONSTANT_NOTES_REF)
          .doc(note.note_id)
          .delete().then( _ => this.uiService.showMessage("Note Deleted"))
      }
    });
    this.clearSelectedNote();
  }
}
