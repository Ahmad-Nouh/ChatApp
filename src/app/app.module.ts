import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule, CanActivate } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

import * as $ from 'jquery';
import { Ng2ImgMaxModule } from 'ng2-img-max';

import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FriendsComponent } from './friends/friends.component';
import { ChatscreenComponent } from './chatscreen/chatscreen.component';
import { ProfileComponent } from './profile/profile.component';
import { UserComponent } from './user/user.component';
import { NavbarComponent } from './navbar/navbar.component';
import { InputboxComponent } from './inputbox/inputbox.component';
import { ChatsComponent } from './chats/chats.component';
import { SearchComponent } from './search/search.component';

import { UserService } from './services/user.service';
import { WebsocketService } from './services/websocket.service';
import { ChatService } from './services/chat.service';
import { XoService } from './services/xo.service';
import { FileUploadService } from './services/file-upload.service';

import { AuthuserGuard } from './authuser.guard';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GamesComponent } from './games/games.component';
import { GameComponent } from './game/game.component';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    FriendsComponent,
    ChatscreenComponent,
    ProfileComponent,
    UserComponent,
    NavbarComponent,
    InputboxComponent,
    ChatsComponent,
    SearchComponent,
    GamesComponent,
    GameComponent,
    TicTacToeComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2ImgMaxModule,
    RouterModule.forRoot([
      {
        path : '' ,
        component : HomeComponent,
        children : [
            {
                path: 'login',
                component : LoginComponent
            },
            {
                path: 'register',
                component : RegisterComponent
            }
          ]
      },
      {
        path : ':user/chats/:chat' ,
        canActivate : [AuthuserGuard],
        component: ChatscreenComponent
      },
      {
        path : ':user/chats' ,
        canActivate : [AuthuserGuard],
        component: ChatsComponent
      },
      {
        path : ':user/chatscreen',
        canActivate : [AuthuserGuard],
        component : ChatscreenComponent
      },
      {
        path : ':user/profile',
        canActivate : [AuthuserGuard],
        component : ProfileComponent
      },
      {
        path : ':user/search',
        canActivate : [AuthuserGuard],
        component : SearchComponent
      },
      {
        path : ':user/game/:game_name/:friend' ,
        component : GameComponent,
      },
      {
        path : ':user',
        canActivate : [AuthuserGuard],
        component : UserComponent
      }
    ]),
    NgbModule.forRoot()
  ],
  providers: [
    UserService,
    ChatService,
    WebsocketService,
    XoService,
    FileUploadService,
    AuthuserGuard
  ],
  bootstrap: [AppComponent]
}) 
export class AppModule { }