import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../helpers/constants';
import { ResponseCode } from '../Models/AuthResponseModel';
import { ForumService } from '../service/forum.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  channelId: string;
  userInfo: any;
  imagePath: any;
  newPost: any;

  constructor(private _sanitizer: DomSanitizer, private forumService: ForumService, private toastr: ToastrService, private route: Router, public dialog: Dialog) { }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl(this.userInfo.profileImageUrl);

  }
  onPostChange(event: any){
    this.newPost = event.target.value;
  }
  onPost(){
    this.forumService.createForum(this.channelId, this.newPost).subscribe({
      next: (successRes: any) => {
        console.log(successRes);
        if(successRes.responseCode == ResponseCode.Ok){
          this.toastr.success("","Forum add successfully", {
            timeOut: 3000
          });
          //this.getAllForumsByChannel(this.channelId);
          this.newPost = "";
          this.route.navigate(['/discussion', this.channelId])
          this.dialog.closeAll();
        }
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

      }
    })
  }

}
