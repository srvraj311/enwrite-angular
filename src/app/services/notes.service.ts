import { Injectable } from '@angular/core';
import Note from '../models/Note';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

const CONSTANT_NOTES_REF: string = 'note';
const CONSTANT_USER_RED: string = 'users';
@Injectable({
  providedIn: 'root',
})
export class NotesService {
  notesArr!: Observable<any[]>;
  binArr!: Observable<any[]>;
  constructor(
    private firestore: AngularFirestore,
    private userService: UserService
  ) {}
  getNotes(): Observable<any[]> {
    const userEmail: string = this.userService.getCurrentEmail();
    this.notesArr = this.firestore
      .collection(CONSTANT_USER_RED)
      .doc(userEmail)
      .collection(CONSTANT_NOTES_REF)
      .valueChanges();
    return this.notesArr;
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
    var time_formats = [
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
    var seconds = (+new Date() - time) / 1000,
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
    var i = 0,
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
}