import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Constants } from '../helpers/constants';
import { ResponseCode } from '../Models/AuthResponseModel';
import { UserDetails } from '../Models/User';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  navigationSubscription;
  userId: string = '';
  userInfo: any;
  myProfile: boolean = false;
  userProfileDetails: UserDetails;
  imagePath: any;
  firstName: string = '';
  lastName: string = '';

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router,
    private _sanitizer: DomSanitizer) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if(e instanceof NavigationEnd){
        this.initialiseInvites();
      }
    })
   }

   initialiseInvites(){
    this.ngOnInit();
   }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('id');
      if(this.userId === this.userInfo.id){
        this.myProfile = true;
      }
    });
    this.getUserProfile(this.userId);
  }

  getUserProfile(userId: string){
    this.userService.GetUserById(userId).subscribe({
      next: (successRes: any) => {
        console.log(successRes);
        if(successRes.responseCode == ResponseCode.Ok){
          this.userProfileDetails = successRes.dataSet;
          this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl(this.userProfileDetails.profileImageUrl);
          let splitUserName = this.userProfileDetails.userName.split(" ");
          this.firstName = splitUserName[0];
          this.lastName = splitUserName[1];
        }
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

      }
    });
  }

  ngOnDestroy(){
    if(this.navigationSubscription){
      this.navigationSubscription.unsubscribe();
    }
  }

}
