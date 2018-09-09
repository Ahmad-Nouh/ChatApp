import { WebsocketService } from './../services/websocket.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal , ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../chats/chats.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {

  private user : User;
  private friend : string;

  closeResult: string;

  constructor(private modalService: NgbModal , private route : ActivatedRoute , private router : Router , userService : UserService) {
    this.user = new User();
  }

  //This 2 methods are used to show modal
  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = 'Closed with: ${result}';
    }, (reason) => {
      this.closeResult = 'Dismissed ${this.getDismissReason(reason)}';
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  'with: ${reason}';
    }
  }
  //------------------------------------------------

  ngOnInit() {
    this.user.username = UserService.username;
    this.friend = this.route.snapshot.paramMap.get('chat');
  }

  sendGameRequest(){
    WebsocketService.sendRequest({
      type : "StartGame_XO",
      data : {
        symbol : "X",
        sender :  UserService.username,
        reciver : this.friend
      }
    });
  }
}
