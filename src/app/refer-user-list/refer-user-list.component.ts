import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../helpers/constants';
import { ResponseCode } from '../Models/AuthResponseModel';
import { ReferRequest } from '../Models/Refer';
import { ReferService } from '../service/refer.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-refer-user-list',
  templateUrl: './refer-user-list.component.html',
  styleUrls: ['./refer-user-list.component.css']
})
export class ReferUserListComponent implements OnInit {

  users: any[] = [];

  forumId: string;
  channelId: string;
  channelName: string;
  forumOwnerName: string;
  forumUserId: string;

  constructor(private referService: ReferService, private userService: UserService, public dialog: Dialog, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  states: string[] = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  selectedStates = this.states;

  onKey(event: any) {
    let searchValue: string = event.target.value;
    searchValue = searchValue.toLowerCase();
    if(searchValue === ""){
      console.log("Empty Search");
      this.getUsers();
    }else{
      console.log(searchValue);
      let filteredUsers = new Array<any>();
      this.users.map((x) => {
        if(x.userName.toLowerCase().indexOf(searchValue) > -1){
          filteredUsers.push(x);
        }
      })
      this.users = filteredUsers;
    }
  }



  onClick(userId: string){
    let senderId = JSON.parse(localStorage.getItem(Constants.USER_KEY))?.id;
    let refer: ReferRequest = {
      forumId: this.forumId,
      forumOwnerName: this.forumOwnerName,
      forumUserId: this.forumUserId,
      channelId: this.channelId,
      channelName: this.channelName,
      senderUserId: senderId,
      receiverUserId: userId
    }
    this.referService.AddRefer(refer).subscribe({
      next: (successRes: any) => {
        console.log(successRes);
        if(successRes.responseCode == ResponseCode.Ok){
          this.dialog.closeAll();
          this.toastr.success("","Refer sent successfull", {
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

  search(event: any) {
    let filter = event.target.value.toLowerCase();
    return this.users.filter(option => option.userName.toLowerCase().startsWith(filter));
  }

  getUsers(){
    this.userService.GetUsers().subscribe({
      next: (successRes) => {
        console.log(successRes);
        this.users = successRes;
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

      }
    })
  }

}
