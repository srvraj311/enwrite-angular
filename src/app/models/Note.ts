import { LoginComponent } from '../pages/login/login.component';

export default interface Note {
  note_id?: string;
  note_title: string;
  note_body: string;
  note_date: number;
  note_colour: string;
  pinned: boolean;
}

export default class Note implements Note {
  constructor(
    id: string,
    title: string,
    body: string,
    date: number,
    colour: string,
    pinned: boolean
  ) {
    this.note_title = title;
    this.note_body = body;
    this.note_date = date;
    this.note_colour = colour;
    this.pinned = pinned;
  }

  static createNoteWithTitleAndBody(title: string, body: string) {
    let date: number = Date.now();
    //TODO : Remember to update these functions
    return new Note('', title, body, date, '#FFFFFF', false);
  }

  static createNoteWithIdTitleBody(id: string, title: string, body: string) {
    let date: number = Date.now();
    return new Note(id, title, body, date, '#FFFFFF', false);
  }
}
