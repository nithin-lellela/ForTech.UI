import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Constants } from '../helpers/constants';
import { ResponseCode } from '../Models/AuthResponseModel';
import { Reply, ReplyRequest } from '../Models/Reply';

@Injectable({
  providedIn: 'root'
})
export class ReplyService {
    private baseApiUrl = environment.baseApiUrl + "Reply/"

    constructor(private httpClient: HttpClient, private _sanitizer: DomSanitizer) { }

    getReplies(forumId: string){
      let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
      return this.httpClient.get(this.baseApiUrl + "GetRepliesByForum/" + forumId + "/" + userInfo.id).pipe(map((res: any) => {
        let replies = new Array<Reply>();
        if(res.responseCode == ResponseCode.Ok){
          if(res.dataSet){
             res.dataSet.map((x: Reply) => {
              let reply: Reply = {
                id: x.id,
                userId: x.userId,
                forumId: x.forumId,
                userName: x.userName,
                description: x.description,
                dateCreated: this.setDate(new Date(x.dateCreated.slice(0,10))) ? "Today" : x.dateCreated.slice(8,10) + "-" + x.dateCreated.slice(5,7) + "-" + x.dateCreated.slice(0,4),
                isLiked: x.isLiked,
                forumReplyUpvotes: x.forumReplyUpvotes,
                profileImageUrl: x.profileImageUrl
              }
              replies.push(reply);
             })
          }
        }
        return replies;
      }))
    }

    addReply(forumId: string, description: string){
      let replyRequest: ReplyRequest = {
        forumId: forumId,
        description: description,
        userId: JSON.parse(localStorage.getItem(Constants.USER_KEY))?.id
      }
      return this.httpClient.post(this.baseApiUrl + "AddReply", replyRequest);
    }

    deleteReply(id: string){
      return this.httpClient.delete(this.baseApiUrl + "DeleteReply/" + id);
    }

    updateReplyUpvotes(replyId: string, userId: string, isVoted: boolean){
      return this.httpClient.put(this.baseApiUrl + "UpdateReplyUpvotes/" + replyId + "/" + isVoted + "/" + userId, "");
    }

    private setDate(dateCreated){
    const date = new Date();
    if(date.toDateString() === dateCreated.toDateString()){
      return true;
    }
    return false;
  }

}
