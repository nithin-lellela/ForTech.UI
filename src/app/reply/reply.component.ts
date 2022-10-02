import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { HotToastModule } from '@ngneat/hot-toast';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../helpers/constants';
import { ResponseCode } from '../Models/AuthResponseModel';
import { Reply, ReplyDetails } from '../Models/Reply';
import { ForumService } from '../service/forum.service';
import { ReplyService } from '../service/reply.service';
import { UserService} from '../service/user.service';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css']
})
export class ReplyComponent implements OnInit {


  @Input() forumId;
  @Input() newComment;
  @Input() isLoggedInUserPost;

  userInfo: any;
  allReplies: Reply[] = [];
  AllRepliesForum: ReplyDetails[] = [];
  imagePath: any;

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router,
    private _sanitizer: DomSanitizer, private forumService: ForumService, private replyService: ReplyService, private toastr: ToastrService) {

   }


  initialiseInvites() {
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl(this.userInfo.profileImageUrl);
    this.getForumReplies(this.forumId);
  }
  ngOnChanges(){
    if(this.newComment !== undefined){
      this.getForumReplies(this.forumId);
      console.log(this.newComment);
    }
  }

  getForumReplies(forumId: string){
    this.replyService.getReplies(forumId).subscribe({
      next: (successRes) => {
        console.log(successRes);
        this.allReplies = successRes;
        let replies = new Array<ReplyDetails>();
        successRes.map((x: any) => {
          let reply: ReplyDetails = {
            id: x.id,
            userId: x.userId,
            forumId: x.forumId,
            userName: x.userName,
            description: x.description,
            dateCreated: x.dateCreated,
            isLiked: x.isLiked,
            forumReplyUpvotes: x.forumReplyUpvotes,
            profileImageUrl: this._sanitizer.bypassSecurityTrustResourceUrl(x.profileImageUrl),
            isLoggedInUserReply: x.userId === this.userInfo.id ? true : false
          }
          replies.push(reply);
        })
        this.AllRepliesForum = replies;
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

      }
    })
  }

  addReply(forumId: string, description: string){
    this.replyService.addReply(forumId, description).subscribe({
      next: (successRes: any) => {
        console.log(successRes);
        if(successRes.responseCode == ResponseCode.Ok){
          this.toastr.success("", successRes.responseMessage, {
            timeOut: 3000
          });
        }
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

      }
    })
  }

  deleteReply(replyId: string){
    this.replyService.deleteReply(replyId).subscribe({
      next: (successRes: any) => {
        console.log(successRes);
        if(successRes.responseCode == ResponseCode.Ok){
          this.toastr.success("", successRes.responseMessage, {
            timeOut: 3000
          });
        }
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

      }
    })
  }

  updateUpvotes(replyId: string, isVoted: boolean){
    let voted: boolean = !isVoted;
    this.replyService.updateReplyUpvotes(replyId, this.userInfo.id, voted).subscribe({
      next: (successRes: any) => {
        console.log(successRes);
        if(successRes.responseCode == ResponseCode.Ok){
          this.AllRepliesForum.map((x: ReplyDetails) => {
            if(x.id === replyId && voted){
              x.isLiked = voted;
              x.forumReplyUpvotes = x.forumReplyUpvotes + 1
            }else if(x.id === replyId && !voted && x.forumReplyUpvotes > 0){
              x.isLiked = voted;
              x.forumReplyUpvotes = x.forumReplyUpvotes - 1
            }
          })
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
