import { temporaryAllocator } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import Note from 'src/app/models/Note';
import { NotesService } from 'src/app/services/notes.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  email!: string;
  name!: string;
  photoUrl! : string;
  constructor(
    private notesService: NotesService,
    private userService: UserService
  ) {
    this.userService.isUserLoggedIn().subscribe((user) => {
      this.name = user?.displayName as string;
      this.email = user?.email as string;
      this.photoUrl = user?.photoURL as string;
      if(!this.name) this.name = 'Welcome'
      if(this.photoUrl === ''  || !this.photoUrl){
        this.photoUrl = 'https://res.cloudinary.com/srvraj311/image/upload/v1626325102/Main_2_hu5xxl.png';
      }
    });
    this.filter('time');
  }
  ngOnInit(): void {
    console.log("Toolbar Initiated")
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
  logout() {
    this.userService.logoutUser().then(() => console.log('User Logged Out Successful'));
  }
  filter(type: string) {
    this.notesService.filterNotes(type);
  }
}
