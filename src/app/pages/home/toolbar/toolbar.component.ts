import { temporaryAllocator } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import Note from 'src/app/models/Note';
import { NotesService } from 'src/app/services/notes.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  email!: string;
  name!: string;
  constructor(
    private notesService: NotesService,
    private userService: UserService
  ) {
    this.userService.isUserLoggedIn().subscribe((user) => {
      this.name = user?.displayName as string;
      this.email = user?.email as string;
    });
  }
  ngOnInit(): void {}
  addNewNote() {
    var tempNote: Note = new Note('new', 'New Note', '', 0, '#FFFFFF', false);
    this.notesService.updateSelectedNote(tempNote);
  }
  logout() {
    this.userService.logoutUser();
  }
}
