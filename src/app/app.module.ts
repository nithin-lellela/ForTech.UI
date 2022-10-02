import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import {MatStepperModule} from '@angular/material/stepper'
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input'
import {MatDialogModule} from '@angular/material/dialog'
import {MatTabsModule} from '@angular/material/tabs'
import {MatSelect} from '@angular/material/select'
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatMenuModule} from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {HttpClientModule} from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ChannelsComponent } from './channels/channels.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import {faAdd as fasAdd} from '@fortawesome/free-solid-svg-icons'
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { RefersComponent } from './refers/refers.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { ReplyComponent } from './reply/reply.component';
import { ToastrModule } from 'ngx-toastr';
import { HotToastModule } from '@ngneat/hot-toast';
import {MatBadgeModule} from '@angular/material/badge'
import {MatCardModule} from '@angular/material/card';
import { ReferUserListComponent } from './refer-user-list/refer-user-list.component';
import { PostComponent } from './post/post.component'
import {MatPaginatorModule} from '@angular/material/paginator'
import {MatTableModule} from '@angular/material/table';
import { NewPostComponent } from './new-post/new-post.component';
import { EditPostComponent } from './edit-post/edit-post.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    ChannelsComponent,
    LeaderboardComponent,
    RefersComponent,
    DiscussionComponent,
    ReplyComponent,
    ReferUserListComponent,
    PostComponent,
    NewPostComponent,
    EditPostComponent
  ],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    BrowserModule,
    AppRoutingModule,
    NgxMatSelectSearchModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatTabsModule,
    NgbModule,
    MatStepperModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatSelectModule,
    HttpClientModule,
    FontAwesomeModule,
    MatBadgeModule,
    MatDialogModule,
    ToastrModule.forRoot({
      timeOut: 8000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressAnimation: 'increasing',
    }),
    HotToastModule.forRoot({
      reverseOrder: true,
      dismissible: true,
      duration: 5000
    }),
    FormsModule
  ],
  exports: [
    MatStepperModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(fasStar, farStar);
  }
 }
