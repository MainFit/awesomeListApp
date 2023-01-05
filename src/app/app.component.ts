import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { UsersService } from './core/services/users.service';

@Component({
  selector: 'al-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.tryAutoLogin();
   }
   
   private tryAutoLogin() {
    // On vérifie s’il existe jeton d’identification stocké.
    const token = localStorage.getItem('token');
    if (!token) { return; }
   
    // On vérifie si le jeton stocké est encore valide.
    const expirationDate = +localStorage.getItem('expirationDate')!; // ! à la fin undique du'une valeeur est non null
    const now = new Date().getTime();
    if (now >= expirationDate) {
     return;
    }
   
    // On connecte l’utilisateur avec les informations de connexions stockées.
    const userId: string = localStorage.getItem('userId')!;
    this.usersService.get(userId).subscribe(user => {
     if(!user) {
      return;
     }
     this.authService.autoLogin(user);
    });
   }
   
  }

