import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { Constants } from '../helpers/constants';
import { ResponseCode } from '../Models/AuthResponseModel';
import { Refer } from '../Models/Refer';
import { ReferService } from '../service/refer.service';

@Component({
  selector: 'app-refers',
  templateUrl: './refers.component.html',
  styleUrls: ['./refers.component.css']
})
export class RefersComponent implements OnInit {

  userInfo: any;
  receivedRefers: any[] = [];
  sentRefers: any[] = [];
  notificationCount: number = 0;

  constructor(private referService: ReferService, public dialog: Dialog) { }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    this.getReceiverRefers(this.userInfo.id);
    this.getSentRefers();
  }

  closeDialogBox(){
    this.dialog.closeAll();
  }

  deleteRefer(id: string){
    this.referService.RemoveRefers(id).subscribe({
      next: (successRes: any) => {
        console.log(successRes);
        if(successRes.responseCode == ResponseCode.Ok){
          this.getReceiverRefers(this.userInfo.id);
        }
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

      }
    })
  }

  getReceiverRefers(id: string){
    this.referService.GetReceiverRefers().subscribe({
      next: (successRes) => {
        console.log(successRes);
        this.receivedRefers = successRes;
        this.notificationCount = this.receivedRefers.length;
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {
      }
    });
  }

  getSentRefers(){
    this.referService.GetSenderRefers().subscribe({
      next: (successRes) => {
        console.log(successRes);
        this.sentRefers = successRes;
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {
      }
    });
  }

}
