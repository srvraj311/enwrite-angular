import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotesService } from 'src/app/services/notes.service';
import { UserService } from 'src/app/services/user.service';
import {UiService} from "../../services/ui.service";
import Note from "../../models/Note";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router,
    private notesService : NotesService
  ) {

  }

  clearSelectedNoteScreen() {
      const note = new Note('empty',
        '',
        '',
        '',
        '#FFFFFF',
        false)
      this.notesService.updateSelectedNote(note);
  }

  ngOnInit(): void {
    this.clearSelectedNoteScreen();
    this.userService.isUserLoggedIn().subscribe((x) => {
      if (x !== null) {
        console.log('HOME : Checking user login and retriving note');
        return;
      } else {
        this.router.navigate(['/login']).then(() => {console.log('Router : Home to Login')})
        return;
      }
    });
  }
}
