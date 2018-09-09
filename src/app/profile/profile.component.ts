import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onFileChange(event) {
    if (event.target.files && event.target.files[0])
    {
      let reader= new FileReader();
      reader.onload = function(e){
        let url = (e.target as any).result;
        $('#image').css("background-image","url("+ url +")");
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  save(){
    
  }
}
