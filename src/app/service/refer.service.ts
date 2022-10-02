import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Constants } from '../helpers/constants';
import { ResponseCode } from '../Models/AuthResponseModel';
import { Refer, ReferRequest } from '../Models/Refer';

@Injectable({
  providedIn: 'root'
})
export class ReferService {

    private baseApiUrl = environment.baseApiUrl + "Refers/"

    public notificationCount: number = 0;

    constructor(private httpClient: HttpClient, private _sanitizer: DomSanitizer) { }

    AddRefer(refer: ReferRequest){
      return this.httpClient.post(this.baseApiUrl + "AddRefer", refer);
    }

    GetNotificationCount(){
      let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
      return this.httpClient.get(this.baseApiUrl + "GetNotificationsCount/" + userInfo.id).pipe(map((res: any) => {
        if(res.responseCode == ResponseCode.Ok){
          if(res.dataSet){
            return res.dataSet;
          }
        }
      }))
    }

    GetReceiverRefers(){
      let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));

      return this.httpClient.get(this.baseApiUrl + "GetReceivedRefers/" + userInfo.id ).pipe(map((res: any) => {
        let refers = new Array<any>();
        if(res.responseCode == ResponseCode.Ok){
          if(res.dataSet){
            res.dataSet.map((x: any) => {
              let refer: any = {
                id : x.id,
                forumId: x.forumId,
                senderUserId: x.senderUserId,
                receiverUserId: x.receiverUserId,
                dateCreated: this.setDate(new Date(x.dateCreated.slice(0,10))) ? "Today" : x.dateCreated.slice(8,10) + "-" + x.dateCreated.slice(5,7) + "-" + x.dateCreated.slice(0,4),
                isReferOpened: x.isReferOpened,
                forumUserName: x.forumUserName,
                forumUserId: x.forumUserId,
                senderUserName: x.senderUserName,
                receiverUserName: x.receiverUserName,
                channelId: x.channelId,
                channelName: x.channelName,
                profileImageUrl: this._sanitizer.bypassSecurityTrustResourceUrl(x.profileImageUrl)
              }
              refers.push(refer);
            });
          }
        }
        return refers
      }))
    }

    GetSenderRefers(){
      let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));

      return this.httpClient.get(this.baseApiUrl + "GetsentRefers/" + userInfo.id ).pipe(map((res: any) => {
        let refers = new Array<any>();
        if(res.responseCode == ResponseCode.Ok){
          if(res.dataSet){
            res.dataSet.map((x: any) => {
              let refer: any = {
                id : x.id,
                forumId: x.forumId,
                senderUserId: x.senderUserId,
                receiverUserId: x.receiverUserId,
                dateCreated: this.setDate(new Date(x.dateCreated.slice(0,10))) ? "Today" : x.dateCreated.slice(8,10) + "-" + x.dateCreated.slice(5,7) + "-" + x.dateCreated.slice(0,4),
                isReferOpened: x.isReferOpened,
                forumUserName: x.forumUserName,
                forumUserId: x.forumUserId,
                senderUserName: x.senderUserName,
                receiverUserName: x.receiverUserName,
                channelId: x.channelId,
                channelName: x.channelName,
                profileImageUrl: this._sanitizer.bypassSecurityTrustResourceUrl(x.profileImageUrl)
              }
              refers.push(refer);
            });
          }
        }
        return refers;
      }));
    }

    UpdateRefers(referId: string){
      return this.httpClient.put(this.baseApiUrl + "UpdateRefer/" + referId, "")
    }
    RemoveRefers(referId: string){
      return this.httpClient.delete(this.baseApiUrl + "RemoveRefer/" + referId)
    }

    private setDate(dateCreated){
    const date = new Date();
    if(date.toDateString() === dateCreated.toDateString()){
      return true;
    }
    return false;
  }
}
