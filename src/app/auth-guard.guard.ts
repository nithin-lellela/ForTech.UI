import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Constants } from './helpers/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(private router: Router){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user = JSON.parse(localStorage.getItem(Constants.USER_KEY));
      if(!user || !user.userName){
        return this.router.createUrlTree(['login']);
      }
      return true;
  }

}

export class AuthGuardLogin implements CanActivate{

  constructor(private router: Router){
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree>{
      const user = JSON.parse(localStorage.getItem(Constants.USER_KEY));
      if(!user || !user.userName){
        return this.router.createUrlTree(['home']);
      }
      return true;
  }
}
