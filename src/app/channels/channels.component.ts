import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../helpers/constants';
import { Channel, ChannelFavRes, FavouriteChannel } from '../Models/Channel';
import { ChannelService } from '../service/channel.service';
import { ForumService } from '../service/forum.service';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {

  channels: Channel[] = [];
  userFavouriteChannels: ChannelFavRes[] = [];
  userDetails: any;
  favChannelsExist: boolean = false;

  constructor(private route: Router, private channelService: ChannelService,
    private forumService: ForumService) { }

  ngOnInit(): void {
    this.getAllChannels();
    this.userDetails = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    this.getFavouriteChannels();
  }

  getAllChannels(){
    this.channelService.GetAll().subscribe({
      next: (successRes) => {
        console.log(successRes);
        this.channels = successRes;
      },
      error: (errorResponse) => {
        console.log(errorResponse);
      },
      complete: () => {
      }
    })
  }

  getFavouriteChannels(){
    this.channelService.GetUserFavChannels(this.userDetails.id).subscribe({
      next: (successRes) => {
        console.log(successRes);
        this.userFavouriteChannels = successRes;
        if(this.userFavouriteChannels.length > 0){
          this.favChannelsExist = true;
        }else{
          this.favChannelsExist = false;
        }
      },
      error: (errorResponse) => {
        console.log(errorResponse);
      },
      complete: () => {
      }
    })
  }

  onFavourite(channelId: string, channelName: string){
    const channelFav: FavouriteChannel = {
      userId: this.userDetails.id,
      userName: this.userDetails.userName,
      channelId: channelId,
      channelName: channelName
    }
    this.channelService.AddToFavourite(channelFav).subscribe({
      next: (successRes) => {
        console.log(successRes);
        this.getFavouriteChannels();
        if(this.userFavouriteChannels.length > 0){
          this.favChannelsExist = true;
        }else{
          this.favChannelsExist = false;
        }
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

      }
    })
  }

  onJoin(channelId: string, channelName: string){
    
  }

  onUnfavourite(channelId: string){
    this.channelService.RemoveFromFavourites(this.userDetails.id, channelId).subscribe({
      next: (successRes) => {
        console.log(successRes);
        this.getFavouriteChannels();
        if(this.userFavouriteChannels.length > 0){
          this.favChannelsExist = true;
        }else{
          this.favChannelsExist = false;
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
