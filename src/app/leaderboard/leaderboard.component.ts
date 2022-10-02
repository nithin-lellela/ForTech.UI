import { Component, OnInit } from '@angular/core';

import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { UserService } from '../service/user.service';

export interface UserData {
  SNo: string;
  Username: string;
  Score: string;
}

/** Constants used to fill up our data base. */

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  displayedColumns: string[] = ['SNo', 'Username', 'Score'];
  dataSource: MatTableDataSource<UserData> = new MatTableDataSource<UserData>();

  @ViewChild(MatPaginator) paginator! :MatPaginator;
  @ViewChild(MatSort) sort! :MatSort;

  userData: UserData[] = [];

  filterString = '';

  users: any[] = [];

  constructor(private userService: UserService) {
    //const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));
    // Assign the data to the data source for the table to render
    this.GetTopUsers();
    this.dataSource = new MatTableDataSource(this.userData);
    console.log(this.dataSource);

   }
  ngOnInit(): void {
    this.UpdateScores();
    this.GetTopUsers();
  }

   ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  UpdateScores(){
    this.userService.UpdateScores().subscribe({
      next: (successRes) => {
        console.log(successRes);
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

      }
    })
  }

  GetTopUsers(){
    this.userService.GetTopUsers().subscribe({
      next: (successRes) => {
        console.log(successRes);
        this.users = successRes;
        let count = 1;
        let userData: UserData[] = [];
        this.users.map((x: any) => {
          let user: UserData = {
            SNo: count.toString(),
            Username: x.name,
            Score: x.score
          }
          count+=1;
          userData.push(user);
        })
        this.userData = userData;
        this.dataSource = new MatTableDataSource<UserData>(this.userData);
        if(this.paginator){
          this.dataSource.paginator = this.paginator;
        }
        if(this.sort){
          this.dataSource.sort = this.sort;
        }
        console.log(this.userData);
      },
      error: (errorRes) => {
        console.log(errorRes);
      },
      complete: () => {

      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

