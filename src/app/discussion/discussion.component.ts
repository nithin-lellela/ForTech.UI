import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EditPostComponent } from '../edit-post/edit-post.component';
import { Constants } from '../helpers/constants';
import { ResponseCode } from '../Models/AuthResponseModel';
import { DiscussionForum, Forum } from '../Models/Forum';
import { NewPostComponent } from '../new-post/new-post.component';
import { ReferUserListComponent } from '../refer-user-list/refer-user-list.component';
import { ChannelService } from '../service/channel.service';
import { ForumService } from '../service/forum.service';
import { ReplyService } from '../service/reply.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.css']
})
export class DiscussionComponent implements OnInit {

  navigationSubscription;
  channelId: string = '';
  channelInfo: any;
  userInfo: any;
  AllForums: Forum[] = [];
  AllDiscussionForums: DiscussionForum[] = [];
  TopForums: Forum[] = [];
  TopDiscussionForums: DiscussionForum[] = [];
  MostRecentForums: Forum[] = [];
  MostDiscussionForums: DiscussionForum[] = [];
  UnansweredForums: Forum[] = [];
  UnansweredDiscussionForums: DiscussionForum[] = [];
  imagePath: any;
  commentBox = "";
  newComment: string | undefined;
  newPost = "";
  enteredSearch: string;

  topTopics: string[] = [];


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
      this.channelId = params.get('id');
      this.getAllForumsByChannel(this.channelId);
      this.getChannel(this.channelId);
      this.getTopForumsByChannel(this.channelId);
      this.getMostForumsByChannel(this.channelId);
      this.getUnansweredForumsByChannel(this.channelId);
    })
    let topics = new Array<string>();
    topics.push("OOP's")
    topics.push("Multithreading")
    topics.push("Concurrency")
    topics.push("DataConnection")
    topics.push("Asyncronous")
    this.topTopics = topics;
  }

  createForumDialog(){
    const dialogRef = this.dialog.open(NewPostComponent, {
      height: '300px',
      width: '700px'
    });
    dialogRef.componentInstance.channelId = this.channelId;

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog Result: ${result}`);
    });
  }

  EditForum(forumId, description){
    const dialogRef = this.dialog.open(EditPostComponent, {
      height: '300px',
      width: '700px'
    });
    dialogRef.componentInstance.channelId = this.channelId;
    dialogRef.componentInstance.forum = description;
    dialogRef.componentInstance.forumId = forumId;

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog Result: ${result}`);
    });
  }

  DeleteForum(id: string){
    this.forumService.deleteForum(id).subscribe({
      next: (successRes: any) => {
        console.log(successRes);
        if(successRes.responseCode == ResponseCode.Ok){
          this.toastr.success("","Forum Deleted", {
            timeOut: 3000
          });
          this.getAllForumsByChannel(this.channelId);
          this.getTopForumsByChannel(this.channelId);
          this.getMostForumsByChannel(this.channelId);
          this.getUnansweredForumsByChannel(this.channelId);
        }
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

      }
    })
  }

  openDialog(id: string, userName: string, userId: string) {
    const dialogRef = this.dialog.open(ReferUserListComponent, {
      height: '300px',
      width: '400px'
    });
    dialogRef.componentInstance.channelId = this.channelId;
    dialogRef.componentInstance.channelName = this.channelInfo.channelName;
    dialogRef.componentInstance.forumId = id;
    dialogRef.componentInstance.forumOwnerName = userName;
    dialogRef.componentInstance.forumUserId = userId;

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog Result: ${result}`);
    });
  }

  fetchMostRecent(){
    this.getMostForumsByChannel(this.channelId);
  }
  fetchTop(){
    this.getTopForumsByChannel(this.channelId);
  }
  fetchUnanswered(){
    this.getUnansweredForumsByChannel(this.channelId);
  }

  onSearchInput(event: any){
    this.enteredSearch = event.target.value;
  }

  onClear(){
    this.getAllForumsByChannel(this.channelId);
    this.enteredSearch = "";
  }

  onSearch(){
    this.forumService.getForumsBySearch(this.channelId, this.enteredSearch).subscribe({
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
        console.log(this.AllDiscussionForums);
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

      }
    })
  }

  getTopForumsByChannel(channelId: string){
    this.forumService.getAllForumsByChannel(channelId, "Top").subscribe({
      next: (successRes) => {
        console.log(successRes);
        this.TopForums = successRes;
        //console.log(this.AllForums);
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
        this.TopDiscussionForums = forums;
        console.log(this.TopDiscussionForums);
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

      }
    });
  }

  getMostForumsByChannel(channelId: string){
    this.forumService.getAllForumsByChannel(channelId, "Recent").subscribe({
      next: (successRes) => {
        console.log(successRes);
        this.MostRecentForums = successRes;
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
        this.MostDiscussionForums = forums;
        console.log(this.MostDiscussionForums);
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

      }
    });
  }

  getAllForumsByChannel(channelId: string){
    this.forumService.getAllForumsByChannel(channelId, "All").subscribe({
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
        console.log(this.AllDiscussionForums);
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

      }
    });
  }

  getUnansweredForumsByChannel(channelId: string){
    this.forumService.getAllForumsByChannel(channelId, "Unanswered").subscribe({
      next: (successRes) => {
        console.log(successRes);
        this.UnansweredForums = successRes;
        //console.log(this.AllForums);
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
        this.UnansweredDiscussionForums = forums;
        //console.log(this.AllDiscussionForums);
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

      }
    });
  }


  showComments(id: string, filter: string){
    if(filter === "All"){
      this.AllDiscussionForums.map((x: DiscussionForum) => {
      if(x.id == id){
        x.hideComment = !x.hideComment;
      }
      })
    }else if(filter === "Top"){
      this.TopDiscussionForums.map((x: DiscussionForum) => {
      if(x.id == id){
        x.hideComment = !x.hideComment;
      }
    })
    }else if(filter === "Recent"){
      this.MostDiscussionForums.map((x: DiscussionForum) => {
      if(x.id == id){
        x.hideComment = !x.hideComment;
      }
    })
    }else if(filter === "Unanswered")
    this.UnansweredDiscussionForums.map((x: DiscussionForum) => {
      if(x.id == id){
        x.hideComment = !x.hideComment;
      }
    })
  }

  updateForumLikes(forumId: string, isLiked: boolean){
    this.forumService.updateForumLikes(forumId, !isLiked).subscribe({
      next: (successRes: any) => {
        console.log(successRes);
        if(successRes.responseCode == ResponseCode.Ok){
          this.AllDiscussionForums.map((x: DiscussionForum) => {
            if(x.id === forumId){
              if(x.isLiked){
                x.forumUpvotes = x.forumUpvotes + 1;
                x.isLiked = !isLiked;
              }else if(!x.isLiked && x.forumUpvotes > 0){
                x.forumUpvotes = x.forumUpvotes - 1;
                x.isLiked = !isLiked;
              }
            }
          })
          /*this.getAllForumsByChannel(this.channelId);
          this.getMostForumsByChannel(this.channelId);
          this.getTopForumsByChannel(this.channelId);
          this.getUnansweredForumsByChannel(this.channelId);*/
        }
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
    this.forumService.createForum(this.channelInfo.id, this.newPost).subscribe({
      next: (successRes: any) => {
        console.log(successRes);
        if(successRes.responseCode == ResponseCode.Ok){
          this.toastr.success("","Forum add successfully", {
            timeOut: 3000
          });
          this.getAllForumsByChannel(this.channelId);
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

  getChannel(channelId: string){
    this.channelService.GetChannel(channelId).subscribe({
      next: (successRes: any) => {
        console.log(successRes);
        if(successRes.responseCode == ResponseCode.Ok){
          if(successRes.dataSet){
            this.channelInfo = successRes.dataSet;
          }
        }
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

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
          this.getAllForumsByChannel(this.channelId);
        }
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

      }
    })
  }

  onForum(id: string){
    this.router.navigate(["/forum", id]);
  }

}

