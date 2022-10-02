import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Constants } from './helpers/constants';
import { RefersComponent } from './refers/refers.component';
import { ReferService } from './service/refer.service';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ForTech';

  routeTitle = "register";
  userName: string ;
  userId: string ;
  navigationSubscription;
  logoutTime: number;
  clearLogoutTime: any;
  profileImageUrl: any = '';
  imagePath: any = '';
  notificationsCount: any = 0;


   constructor(private userService: UserService, private router: Router, private _sanitizer: DomSanitizer, public dialog: MatDialog, private referService: ReferService){
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if(e instanceof NavigationEnd){
        this.initialiseInvites();
      }
    })
  }

  ngOnInit(): void{
    this.getUserInfo();
    const userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    if(userInfo && userInfo.userName){
      this.router.navigate(['home']);
      this.profileImageUrl = userInfo.profileImageUrl
      this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl(this.profileImageUrl);
    }
    this.GetNotificationsCount();

  }

  ngOnChanges(){

  }


  ngOnDestroy(){
    if(this.navigationSubscription){
      this.navigationSubscription.unsubscribe();
      this.GetNotificationsCount();
    }
  }

   get isUserLoggedIn(){
    const user = localStorage.getItem(Constants.USER_KEY);
    return user && user.length>0;
  }

  openDialog(){
    const dialogRef = this.dialog.open(RefersComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog Result: ${result}`);
    });
  }

  GetNotificationsCount(){
    this.referService.GetNotificationCount().subscribe({
      next: (successRes) => {
        console.log(successRes);
        this.notificationsCount = successRes;
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

      }
    })
  }

  onChange(){
    if(this.routeTitle == "register"){
      this.routeTitle = "login";
    }else{
      this.routeTitle = "register";
    }
  }

  initialiseInvites(){
    this.getUserInfo();
    this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl(this.profileImageUrl);
    let date = new Date().getTime();
    let expiresIn = this.logoutTime - date;
    //console.log(expiresIn);
    //this.autoLogout(expiresIn);
  }

  getUserInfo(){
    let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    this.userId = userInfo?.id;
    this.userName = userInfo?.userName.charAt(0).toUpperCase() + userInfo?.userName.slice(1);
    this.profileImageUrl = userInfo.profileImageUrl
    //this.logoutTime = JSON.parse(localStorage.getItem(Constants.LOGOUT_TIME));
  }

  /*autoLogout(expiresIn: number){
    this.clearLogoutTime = setTimeout(() => {
      this.onLogout();
    }, expiresIn);
  }*/

  onLogout(){
    localStorage.removeItem(Constants.USER_KEY);
    if(this.clearLogoutTime){
      clearTimeout(this.clearLogoutTime);
    }
    this.router.navigate(['/login']);
    this.ngOnInit();
  }

}
