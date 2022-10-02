import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Constants } from '../helpers/constants';
import { ResponseCode } from '../Models/AuthResponseModel';
import { Forum } from '../Models/Forum';

@Injectable({
  providedIn: 'root'
})
export class ForumService {

  private baseApiUrl = environment.baseApiUrl + "Forum/"

  constructor(private httpClient: HttpClient, private _sanitizer: DomSanitizer) { }

  updateForum(channelId: string, description: string, forumId: string){
    let object: Object = {
      id: forumId,
      channelId: channelId,
      description: description,
      userId: JSON.parse(localStorage.getItem(Constants.USER_KEY))?.id
    }
    return this.httpClient.put(this.baseApiUrl + "UpdateForum", object)
  }

  deleteForum(id: string){
    return this.httpClient.delete(this.baseApiUrl + "DeleteForum/" + id);
  }

  getForumsBySearch(channelId: string, search: string){
    let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    return this.httpClient.get(this.baseApiUrl + "GetForumsInChannelBySearch/" + channelId + "/" + userInfo.id + "/" + search).pipe(map((res: any) => {
      let channelForums = new Array<Forum>();
      if(res.responseCode == ResponseCode.Ok){
        if(res.dataSet){
          res.dataSet.map((x: Forum) => {
            let forum: Forum = {
              id: x.id,
              userId: x.userId,
              channelId: x.channelId,
              userName: x.userName,
              channelName: x.channelName,
              description: x.description,
              dateCreated: this.setDate(new Date(x.dateCreated.slice(0,10))) ? "Today" : x.dateCreated.slice(8,10) + "-" + x.dateCreated.slice(5,7) + "-" + x.dateCreated.slice(0,4),
              isLiked: x.isLiked,
              forumUpvotes: x.forumUpvotes,
              forumReplies: x.forumReplies,
              profileImageUrl: x.profileImageUrl
            };
            channelForums.push(forum);
          });
        }
      }
      return channelForums;
    }))
  }

  getForumById(id: string){
    let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    return this.httpClient.get(this.baseApiUrl + "GetForumById/" + id + "/" + userInfo.userId).pipe(map((res: any) => {
      let forum: Forum;
      if(res.responseCode == ResponseCode.Ok){
        if(res.dataSet){
          forum = res.dataSet;
        }
      }
      return forum;
    }))
  }

  getUserForums(id: string){
    return this.httpClient.get(this.baseApiUrl + "GetForumsByUser/" + id).pipe(map((res: any) => {
      let channelForums = new Array<Forum>();
      if(res.responseCode == ResponseCode.Ok){
        if(res.dataSet){
          res.dataSet.map((x: Forum) => {
            let forum: Forum = {
              id: x.id,
              userId: x.userId,
              channelId: x.channelId,
              userName: x.userName,
              channelName: x.channelName,
              description: x.description,
              dateCreated: this.setDate(new Date(x.dateCreated.slice(0,10))) ? "Today" : x.dateCreated.slice(8,10) + "-" + x.dateCreated.slice(5,7) + "-" + x.dateCreated.slice(0,4),
              isLiked: x.isLiked,
              forumUpvotes: x.forumUpvotes,
              forumReplies: x.forumReplies,
              profileImageUrl: x.profileImageUrl
            };
            channelForums.push(forum);
          });
        }
      }
      return channelForums;
    }))
  }

  getAllForumsByChannel(channelId: string, filter: string){
    let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));

    return this.httpClient.get(this.baseApiUrl + "GetForumsByChannel/" + channelId + "/" + userInfo.id + "/" + filter).pipe(map((res: any) => {
      let channelForums = new Array<Forum>();
      if(res.responseCode == ResponseCode.Ok){
        if(res.dataSet){
          res.dataSet.map((x: Forum) => {
            let forum: Forum = {
              id: x.id,
              userId: x.userId,
              channelId: x.channelId,
              userName: x.userName,
              channelName: x.channelName,
              description: x.description,
              dateCreated: this.setDate(new Date(x.dateCreated.slice(0,10))) ? "Today" : x.dateCreated.slice(8,10) + "-" + x.dateCreated.slice(5,7) + "-" + x.dateCreated.slice(0,4),
              isLiked: x.isLiked,
              forumUpvotes: x.forumUpvotes,
              forumReplies: x.forumReplies,
              profileImageUrl: x.profileImageUrl
            };
            channelForums.push(forum);
          });
        }
      }
      return channelForums;
    }))
  }

  updateForumLikes(forumId: string, isLiked: boolean){
    let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));

    return this.httpClient.put(this.baseApiUrl + "UpdateForumUpvotes/" + forumId + "/" + isLiked + "/" + userInfo.id, "");
  }

  createForum(cannelId: string, descr: string){
    let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    let addPost: object = {
      userId: userInfo.id,
      channelId: cannelId,
      description: descr
    }
    return this.httpClient.post(this.baseApiUrl + "CreateForum", addPost);
  }

  private setDate(dateCreated){
    const date = new Date();
    if(date.toDateString() === dateCreated.toDateString()){
      return true;
    }
    return false;
  }

}
