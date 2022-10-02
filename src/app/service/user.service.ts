import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Constants } from '../helpers/constants';
import { ResponseCode } from '../Models/AuthResponseModel';
import { LoginDetails, RegisterUser } from '../Models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseApiUrl = environment.baseApiUrl + "User/"

  constructor(private httpClient: HttpClient, private _sanitizer: DomSanitizer) { }

  Register(registerUser: RegisterUser){
    return this.httpClient.post(this.baseApiUrl + "Register", registerUser);
  }

  Login(loginUser: LoginDetails){
    return this.httpClient.post(this.baseApiUrl + "Login", loginUser);
  }

  GetTopFive(){
    this.UpdateScores();
    return this.httpClient.get(this.baseApiUrl + "GetTopUsers").pipe(map((res: any) => {
      let topUsers: any[] = [];
      var count = 0;
      if(res.responseCode == ResponseCode.Ok){
        if(res.dataSet){
          res.dataSet.map((x: any) => {
            if(count===5){
              return;
            }
            count = count + 1;
            topUsers.push(x);
          })
        }
      }
      return topUsers;
    }));
  }

  GetTopUsers(){
    this.UpdateScores();
    return this.httpClient.get(this.baseApiUrl + "GetTopUsers").pipe(map((res: any) => {
      let topUsers: any[] = [];
      if(res.responseCode == ResponseCode.Ok){
        if(res.dataSet){
          res.dataSet.map((x: any) => {
            topUsers.push(x);
          })
        }
      }
      return topUsers;
    }));
  }

  UpdateScores(){
    return this.httpClient.put(this.baseApiUrl + "UpdateUserScore", "");
  }


  GetUserById(id: string){
    let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    const headers = new HttpHeaders({
      "Authorization": `Bearer ${userInfo?.token}`
    });
    return this.httpClient.get(this.baseApiUrl + "GetUser/" + id, {headers: headers});
  }

  GetUsers(){
    let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    const headers = new HttpHeaders({
      "Authorization": `Bearer ${userInfo?.token}`
    });
    return this.httpClient.get(this.baseApiUrl + "GetAllUsers", {headers: headers}).pipe(map((res: any) => {
      let users = new Array<any>();
      if(res.responseCode == ResponseCode.Ok){
        if(res.dataSet){
          res.dataSet.map((x: any) => {
            let user: any = {
              id: x.id,
              userName: x.userName,
              score: x.score,
              email: x.email,
              profileImageUrl: this._sanitizer.bypassSecurityTrustResourceUrl(x.profileImageUrl)
            }
            users.push(user);
          });
        }
      }
      return users;
    }))
  }

  

}

