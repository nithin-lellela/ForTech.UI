import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ResponseCode } from '../Models/AuthResponseModel';
import { Channel, ChannelFavRes, FavouriteChannel } from '../Models/Channel';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  private baseApiUrl = environment.baseApiUrl + "Channels/";

  constructor(private httpClient: HttpClient) { }

  GetChannel(channelId: string){
    return this.httpClient.get(this.baseApiUrl + "GetChannel/" + channelId);
  }

  GetTop(){
    this.UpdateInteractions();
    return this.httpClient.get(this.baseApiUrl + "TopChannels").pipe(map((res: any) => {
      let channels = new Array<Channel>();
      if(res.responseCode == ResponseCode.Ok){
        if(res.dataSet){
          res.dataSet.map((x: Channel) => {
            let channel: Channel = {
              id: x.id,
              channelName: x.channelName,
              noOfInteractions: x.noOfInteractions
            };
            channels.push(channel);
          });
        }
      }
      return channels;
    }));
  }

  UpdateInteractions(){
    return this.httpClient.put(this.baseApiUrl + "UpdateChannelInteractions", "");
  }

  GetAll(){
    return this.httpClient.get(this.baseApiUrl + "GetAllChannels").pipe(map((res: any) => {
      let channels = new Array<Channel>();
      if(res.responseCode == ResponseCode.Ok){
        if(res.dataSet){
          res.dataSet.map((x: Channel) => {
            let channel: Channel = {
              id: x.id,
              channelName: x.channelName,
              noOfInteractions: x.noOfInteractions
            };
            channels.push(channel);
          });
        }
      }
      return channels;
    }));
  }

  AddToFavourite(favouriteChannel: FavouriteChannel){
    return this.httpClient.post(this.baseApiUrl + "AddToFavourites", favouriteChannel);
  }

  GetUserFavChannels(id: string){
    return this.httpClient.get(this.baseApiUrl + "GetUserFavourites/" + id).pipe(map((res: any) => {
      let channels = new Array<ChannelFavRes>();
      if(res.responseCode == ResponseCode.Ok){
        if(res.dataSet){
          res.dataSet.map((x: ChannelFavRes) => {
            let channel: ChannelFavRes = {
              id: x.id,
              channelName: x.channelName,
              channelId: x.channelId,
              userId: x.userId,
              userName: x.userName
            };
            channels.push(channel);
          });
        }
      }
      return channels;
    }));
  }

  RemoveFromFavourites(userId: string, channelId: string){
    return this.httpClient.delete(this.baseApiUrl + "DeleteUserFavourite/" + userId + "/" + channelId);
  }

}
