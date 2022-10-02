import { Component, OnInit } from '@angular/core';
import { Constants } from '../helpers/constants';
import { DomSanitizer } from '@angular/platform-browser';
import { ForumService } from '../service/forum.service';
import { ResponseCode } from '../Models/AuthResponseModel';
import { UserService } from '../service/user.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ReplyService } from '../service/reply.service';
import { ToastrService } from 'ngx-toastr';
import { ChannelService } from '../service/channel.service';
import { DiscussionForum, Forum } from '../Models/Forum';
import { Channel } from '../Models/Channel';
import { Dialog } from '@angular/cdk/dialog';
import { ReferUserListComponent } from '../refer-user-list/refer-user-list.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userName: string  = '';
  imagePath: any = '';
  toReturnImage: any = '';
  userInfo: any;
  newPost = "";
  navigationSubscription: any;
  AllForums: Forum[] = [];
  AllDiscussionForums: DiscussionForum[] = [];
  commentBox: "";
  newComment: string | undefined;
  selectedValue: "";
  topChannels: Channel[] = [];
  allChannels: Channel[] = [];
  topUsers: any[] = [];


  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router,
    private _sanitizer: DomSanitizer, private forumService: ForumService, private channelService: ChannelService,
    private replyService: ReplyService, private toastr: ToastrService, public dialog: Dialog) {
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if(e instanceof NavigationEnd){
        this.initialiseInvites();
      }
    })
    }

  initialiseInvites() {
    this.ngOnInit();
  }


  ngOnInit(): void {
    this.userName = JSON.parse(localStorage.getItem(Constants.USER_KEY)).userName;
    this.toReturnImage = JSON.parse(localStorage.getItem(Constants.USER_KEY)).profileImageUrl;
    this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl(this.toReturnImage);
    this.userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    this.getUserForums(this.userInfo.id);
    this.getAllChannels();
    this.getTopChannels();
    this.getTopUsers();
    console.log(this.imagePath);
  }

  getAllChannels(){
    this.channelService.GetAll().subscribe({
      next: (successRes) => {
        console.log(successRes);
        this.allChannels = successRes;
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

      }
    })
  }

   openDialog(id: string, userName: string, userId: string, channelId: string, channelName: string) {
    const dialogRef = this.dialog.open(ReferUserListComponent, {
      height: '300px',
      width: '400px'
    });
    dialogRef.componentInstance.channelId = channelId;
    dialogRef.componentInstance.channelName = channelName;
    dialogRef.componentInstance.forumId = id;
    dialogRef.componentInstance.forumOwnerName = userName;
    dialogRef.componentInstance.forumUserId = userId;

    /*dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog Result: ${result}`);
    });*/
  }

  getTopUsers(){
    this.userService.GetTopFive().subscribe({
      next: (successRes) => {
        console.log(successRes);
        this.topUsers = successRes;
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

      }
    })
  }

  getTopChannels(){
    this.channelService.GetTop().subscribe({
      next: (successRes) => {
        console.log(successRes);
        this.topChannels = successRes;
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

      }
    })
  }

  onPostChange(event: any){
    this.newPost = event.target.value;
  }
  onPost(){
    this.forumService.createForum(this.selectedValue, this.newPost).subscribe({
      next: (successRes: any) => {
        console.log(successRes);
        if(successRes.responseCode == ResponseCode.Ok){
          this.toastr.success("","Forum add successfully", {
            timeOut: 3000
          });
          this.getUserForums(this.userInfo.id);
          this.newPost = "";
        }
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

      }
    })
  }

  getUserForums(id: string){
    this.forumService.getUserForums(id).subscribe({
      next: (successRes) => {
        console.log(successRes);
        this.AllForums = successRes;
        console.log(this.AllForums);
        let forums = new Array<DiscussionForum>();
        successRes.map((x: any) => {
          let forum: DiscussionForum = {
              id: x.id,
              userId: x.userId,
              channelId: x.channelId,
              userName: x.userName,
              channelName: x.channelName,
              description: x.description,
              dateCreated: x.dateCreated,
              isLiked: x.isLiked,
              forumUpvotes: x.forumUpvotes,
              forumReplies: x.forumReplies,
              profileImagePath: this._sanitizer.bypassSecurityTrustResourceUrl(x.profileImageUrl),
              isLoggedInUserPost: x.userId === this.userInfo.id ? true : false,
              hideComment: true
          }
          forums.push(forum);

        })
        this.AllDiscussionForums = forums;
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

      }
    })
  }

  showComments(id: string){
    this.AllDiscussionForums.map((x: DiscussionForum) => {
      if(x.id === id){
        x.hideComment = !x.hideComment;
      }
    })
  }

  onTextChange(event: any){
    this.commentBox = event.target.value;
  }

  onReply(forumId: string){
    let description: string  = this.commentBox;
    this.replyService.addReply(forumId, description).subscribe({
      next: (successRes: any) => {
        console.log(successRes);
        if(successRes.responseCode == ResponseCode.Ok){
          this.toastr.success("", successRes.responseMessage, {
            timeOut: 3000
          });
          this.newComment = successRes;
          this.getUserForums(this.userInfo.id);
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
