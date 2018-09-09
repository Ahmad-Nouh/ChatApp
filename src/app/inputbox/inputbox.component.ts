import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inputbox',
  templateUrl: './inputbox.component.html',
  styleUrls: ['./inputbox.component.css']
})
export class InputboxComponent implements OnInit {
  constructor() { }

  ngOnInit() {}

  LoadScript(src : string)
  {
    let script = document.createElement("script");
    script.setAttribute("type" , "text/javascript");
    script.setAttribute("src" , src);
    let body = document.getElementsByTagName("body")[0];
    body.appendChild(script);
  }

}
