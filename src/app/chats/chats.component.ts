import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';

export class User
{
  public username : string;
  public firstname : string;
  public lastname : string;
  User()
  {
    
  }
}

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css'],
  providers: [UserService]
})

export class ChatsComponent implements OnInit {
  private user : User;
  private chats : string[];
  private group : string[];

  constructor(private route : ActivatedRoute) {
    this.user = new User();
    this.group = [];
  }

  ngOnInit() {
    this.user.username = this.route.snapshot.paramMap.get('user');
    this.chats = UserService.chats;
  }

  onFileChange(event) {
    if (event.target.files && event.target.files[0])
    {
      let reader= new FileReader();
      reader.onload = function(e){
        let url = (e.target as any).result;
        $('#groupImage').css("background-image","url("+ url +")");
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  selectUser($event){
    $event.stopPropagation();
    let div = $event.target;
    let checkbox = div.nextElementSibling;
    console.log(div);
    console.log(checkbox);

    if (checkbox.checked)
    {
      checkbox.checked = false;
      //delete from array
      let index = this.group.indexOf(checkbox.value);
      if (index != -1){
        this.group.splice(index , 1);
      }
      div.style.backgroundColor = "#efefef"; 
    }
    else
    {
      checkbox.checked = true;
      this.group.push(checkbox.value);
      div.style.backgroundColor = "#a3a3a3";
    }
  }
  
  filterFunction() {
    var input, filter, ul, li, a, i,div;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = (div as HTMLElement).getElementsByTagName("a");

    for (i = 0; i < a.length; i++) {
      let div1 = a[i].children[0] as HTMLElement;
      let div2 = div1.children[1] as HTMLElement;
      let h5 = div2.children[0] as HTMLElement;
      if (h5.innerHTML.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }

  reset(){
    this.group.length = 0;
    let users = document.getElementsByClassName("query");
    for (let i=0;i<users.length;i++){
      let user = users[i] as HTMLElement;
      user.style.backgroundColor = "#efefef";
    }
    let url = "../../assets/icons/group.png";
    $('#groupImage').css("background-image","url("+ url +")");
  }

  creatGroup(){
    console.log(this.group);
  }
}
