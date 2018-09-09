import { WebsocketService } from './services/websocket.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable()
export class AuthuserGuard implements CanActivate {

  constructor(private router : Router){ }
  canActivate(next: ActivatedRouteSnapshot , state: RouterStateSnapshot): boolean {
    /* var loggedIn = WebsocketService.get_UserLogin();
    if (!loggedIn){
      this.router.navigate(['/login']);
      alert('you should login first');
    }
    return loggedIn; */
    return true;
  }
}
