import { Injectable } from '@angular/core';
import Note from '../models/Note';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  //notesArr: Observable<Note[]>;
  constructor(db: Firestore) {
    const user = collectionData(collection(db, 'users'));
    console.log(user);
  }

  getNotes(): void {}
}
