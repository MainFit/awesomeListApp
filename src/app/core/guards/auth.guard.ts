import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router) {}
    canActivate(): Observable<boolean> {
      return this.authService.user$.pipe(
       map(user => !!user), // !!user vaudra soit vrai, soit faux !
       tap(isLogged => {
        if(!isLogged) {
         this.router.navigate(['/login']);
         return false;
        }
     
        return true;
       })
      );
     }
     
     canActivateChild(): Observable<boolean> {
      return this.canActivate();
     }
  
}
