export default interface Note {
  note_id: string;
  note_title: string;
  note_body: string;
  note_date: string;
  note_colour: string;
  pinned: boolean;
}

export default class Note implements Note {
  constructor(
    note_id: string,
    note_title: string,
    note_body: string,
    note_date: string,
    note_colour: string,
    pinned: boolean
  ) {
    this.note_id = note_id;
    this.note_title = note_title;
    this.note_body = note_body;
    this.note_date = note_date;
    this.note_colour = note_colour;
    this.pinned = pinned;
  }

  static createNoteWithTitleAndBody(title: string, body: string) {
    let date: string = String(Date.now());
    //TODO : Remember to update these functions
    return new Note('', title, body, date, '#FFFFFF', false);
  }

  static createNoteWithIdTitleBody(id: string, title: string, body: string) {
    let date: string = String(Date.now());
    return new Note(id, title, body, date, '#FFFFFF', false);
  }
}
