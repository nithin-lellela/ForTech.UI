import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../helpers/constants';
import { ResponseCode } from '../Models/AuthResponseModel';
import { DiscussionForum, Forum } from '../Models/Forum';
import { ReferUserListComponent } from '../refer-user-list/refer-user-list.component';
import { ChannelService } from '../service/channel.service';
import { ForumService } from '../service/forum.service';
import { ReplyService } from '../service/reply.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  Forums: DiscussionForum[] = [];
  AllForums: Forum[] = [];
  newComment: any;
  commentBox = "";
  navigationSubscription: any;
  userInfo: any;
  imagePath: any;
  forumId: string;
  forum: DiscussionForum;
  allForum: Forum;

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router,
    private _sanitizer: DomSanitizer, private forumService: ForumService, private channelService: ChannelService,
    private replyService: ReplyService, private toastr: ToastrService, public dialog: MatDialog) {
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
    this.userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl(this.userInfo.profileImageUrl);
    this.route.paramMap.subscribe((params) => {
      this.forumId = params.get('id');
      this.getForumById(this.forumId);

    })
  }

  getForumById(forumId: string){
    this.forumService.getForumById(forumId).subscribe({
      next: (successRes) => {
        console.log(successRes);
        this.allForum = successRes;
        let forum: DiscussionForum = {
              id: successRes.id,
              userId: successRes.userId,
              channelId: successRes.channelId,
              userName: successRes.userName,
              channelName: successRes.channelName,
              description: successRes.description,
              dateCreated: successRes.dateCreated,
              isLiked: successRes.isLiked,
              forumUpvotes: successRes.forumUpvotes,
              forumReplies: successRes.forumReplies,
              profileImagePath: this._sanitizer.bypassSecurityTrustResourceUrl(successRes.profileImageUrl),
              isLoggedInUserPost: successRes.userId === this.userInfo.id ? true : false,
              hideComment: true
        }
        this.forum = forum;
        console.log(forum);
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

      }
    })
  }

  showComments(){
    this.forum.hideComment = !this.forum.hideComment;
  }

  updateForumLikes(id: string, isLiked: boolean){

  }

  openDialog(id: string, userName: string, userId: string){
    const dialogRef = this.dialog.open(ReferUserListComponent, {
      height: '300px',
      width: '400px'
    });
    dialogRef.componentInstance.channelId = this.forum.channelId;
    dialogRef.componentInstance.channelName = this.forum.channelName;
    dialogRef.componentInstance.forumId = id;
    dialogRef.componentInstance.forumOwnerName = userName;
    dialogRef.componentInstance.forumUserId = userId;

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog Result: ${result}`);
    });
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
          this.getForumById(this.forumId);
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
