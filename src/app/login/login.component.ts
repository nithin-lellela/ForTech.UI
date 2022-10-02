import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Constants } from '../helpers/constants';
import { ResponseCode } from '../Models/AuthResponseModel';
import { LoginDetails } from '../Models/User';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  constructor(private userService: UserService,
    private toast: HotToastService,
    private router: Router) { }

  ngOnInit(): void {
  }

  get email(){
    return this.loginForm.get('email');
  }
  get password(){
    return this.loginForm.get('password');
  }

  onSubmit(){
    if(!this.loginForm.valid){
      this.toast.warning("Please enter all the fields !", {
        duration: 2000
      });
      return;
    }
    const loginDetails: LoginDetails = {
      email : this.loginForm.controls.email.value,
      password : this.loginForm.controls.password.value
    };
    this.userService.Login(loginDetails).subscribe({
      next: (successResponse: any) => {
        console.log(successResponse)
        if(successResponse.responseCode == ResponseCode.Ok){
          localStorage.setItem(Constants.USER_KEY, JSON.stringify(successResponse.dataSet));
          //let date = new Date().getTime() + (3300*1000);
          //localStorage.setItem(Constants.LOGOUT_TIME, JSON.stringify(date));
          //this.userService.isAuthenticated = true;
          this.toast.success("Successfully Logged In", {
            duration: 3000
            });
            this.router.navigate(['/home']).then(() => {
              window.location.reload();
            });
        }else if(successResponse.responseCode == ResponseCode.Error){
          this.toast.error("Invalid Login Details", {
            duration: 2000
          });
        }
      },
      error: (errorResponse) => {
        this.toast.error('Invalid Login details', {
          duration: 3000
        });
        console.log(errorResponse)
      },
      complete: () => {
      }
    });
  }

  onChangeRoute(route: string){
    localStorage.setItem("route", JSON.stringify(route));
  }

}
