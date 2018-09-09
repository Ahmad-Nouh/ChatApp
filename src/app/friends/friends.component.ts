import { Component, OnInit } from '@angular/core';
import { NgbModal , ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../services/user.service';
import { User } from '../chats/chats.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  private friends : string[];
  private user : User;

  closeResult: string;

  constructor(private modalService: NgbModal , private route : ActivatedRoute , private router : Router) {
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

  closeModal()
  {
    
  }
  ngOnInit() {
    this.user.username = UserService.username;
    this.friends = UserService.friends;
    console.log(this.friends);
  }
  NewChat(friend : string){
    UserService.chats.push(friend);
  }
}
