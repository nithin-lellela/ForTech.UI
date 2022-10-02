import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from './auth-guard.guard';
import { ChannelsComponent } from './channels/channels.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { HomeComponent } from './home/home.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { LoginComponent } from './login/login.component';
import { PostComponent } from './post/post.component';
import { ProfileComponent } from './profile/profile.component';
import { RefersComponent } from './refers/refers.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: '', component: RegisterComponent,
  pathMatch: 'full', runGuardsAndResolvers:'always', canActivate: [AuthGuardGuard]},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuardGuard]},
  {path: 'channels', component: ChannelsComponent, canActivate: [AuthGuardGuard]},
  {path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuardGuard]},
  {path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuardGuard]},
  {path: 'refers', component: RefersComponent, canActivate: [AuthGuardGuard]},
  {path: 'discussion/:id', component: DiscussionComponent, canActivate: [AuthGuardGuard]},
  {path: 'forum/:id', component: PostComponent, canActivate: [AuthGuardGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
