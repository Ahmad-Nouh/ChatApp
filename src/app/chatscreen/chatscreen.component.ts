import { Extentions } from './../services/extentions';
import { FileUploadService } from './../services/file-upload.service';
import { WebsocketService } from './../services/websocket.service';
import { Component, OnInit, HostListener, EventEmitter, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
//imageCompress
import { Ng2ImgMaxService } from 'ng2-img-max';
import { DomSanitizer } from '@angular/platform-browser';
import { ChatService ,Record } from '../services/chat.service';
import { DatePipe } from '@angular/common';

//import { DHKE } from '../DHKE';

@Component({
  selector: 'app-chatscreen',
  templateUrl: './chatscreen.component.html',
  styleUrls: ['./chatscreen.component.css']
})

export class ChatscreenComponent implements OnInit {
  private messagebox ;
  private uploadedImage: File;
  private imagePreview : string; //thumbnail
  private image_sent : string;
  private fileURL : string;
  private username : string;
  private friendname : string;
  private recordIndex : number;
  private imageAfterCompress : File;
  private status : boolean;
  private lastSeen : string;
  private blocked : boolean = true;

  constructor(private route : ActivatedRoute, private ng2ImgMax: Ng2ImgMaxService, public sanitizer: DomSanitizer ,
    private websocketService : WebsocketService , private chatService : ChatService, private fileUploader : FileUploadService,
    private element : ElementRef) {

    this.messagebox = "";
    this.imagePreview = "";
    this.image_sent = "";
    this.fileURL = "";
  }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('user');
    this.friendname = this.route.snapshot.paramMap.get('chat');
    this.start_private_chat();
    this.blocked = UserService.checkIfBlocked(this.friendname);

    if (this.blocked){
      this.disableForm();
    }

    this.getLastRecords();
  }

  onFileChange(event) {
    let file = event.target.files[0];

    let ext= (file.name as string).split('.').pop();
    console.log(ext);
    switch(ext.toLowerCase())
    {
      //if the file is image
      case 'jpg':
      case 'gif':
      case 'bmp':
      case 'png':
      {
        this.compressImage(file);
        break;
      }
      //else
      case 'pdf':
      {
        this.imagePreview = Extentions.pdf;
        break;
      }
      case 'txt':
      {
        this.imagePreview = Extentions.txt;
        break;
      }
      case 'exe':
      {
        this.imagePreview = Extentions.exe;
        break;
      }
      case 'apk':
      {
        this.imagePreview = Extentions.apk;
        break;
      }
      case 'html':
      {
        this.imagePreview = Extentions.html;
        break;
      }
      case 'mp3':
      {
        this.imagePreview = Extentions.mp3;
        break;
      }
      case 'mp4':
      {
        this.imagePreview = Extentions.mp4;
        break;
      }
      case 'zip':
      {
        this.imagePreview = Extentions.zip;
        break;
      }
      case 'rar':
      {
        this.imagePreview = Extentions.rar;
        break;
      }
    }
    this.fileURL = file.name;
    console.log(this.imagePreview);
    this.image_sent = this.imagePreview;

    //show image into modal using bootstrap
    (<any>$("#myModal")).modal({
      show : true
    });
  }

  getImagePreview(file: File) {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file); // convert image to string url using base64 encoding
    reader.onload = () => {
      this.imagePreview = reader.result; //image as string url
    };
  }

  insertMessage(text :string , date : string) :HTMLElement{
    let div = document.createElement('div');
    let div2 = document.createElement('div');
    let span = document.createElement('span');
    let status = document.createElement('img');

    div.innerText = text;
    span.innerText = date;
    status.src = "../../assets/icons/wait2.png";

    span.setAttribute("class","time");
    div.setAttribute("class","card text-white bg-secondary mb-3 offset-7 col-4");

    div2.appendChild(span);
    div2.appendChild(status);
    div.appendChild(div2);

    $("#chatscreen").append(div);
    //clear input
    $("#chatbox").val("");

    if (text != "")
      return div;
    else
      return undefined;
  }
  
  insertImage(date : string) : HTMLElement{
    let div = document.createElement('div');
    let div2 = document.createElement('div');
    let span = document.createElement('span');
    let status = document.createElement('img');
    let image = document.createElement("img");
    
    span.setAttribute("class","time");
    div.setAttribute("class","card text-white bg-secondary mb-3 offset-5 col-6");

    span.innerText = date;
    status.src = "../../assets/icons/wait2.png";
    div.style.padding = "0px";
    
    if (this.imagePreview!="data:,")
    {
      image.src = this.imagePreview;
      image.setAttribute("width","100%");
      div2.appendChild(span);
      div2.appendChild(status);
      div.appendChild(image);
      div.appendChild(div2);

      $('#chatscreen').append(div);

      /* let chatscreen_info = $('#chatscreen').html();
      chatscreen_info += div.outerHTML;
      $('#chatscreen').html(chatscreen_info); */
      return div;
    }
    else
      return undefined;
  }

  sendMessage(form : NgForm) : void{

    let text = $("#chatbox").val().toString();
    if (text)
    {
      let date_sent = Date().toString();
      let datapipe = new DatePipe("en-US");
      date_sent = datapipe.transform(date_sent , 'h:mm a');

      let msg : any = {
      type : 'text_message',
        data : {
          type : 'text_message',
            ID1 : WebsocketService.messageID,
            ID2 : -1,
            sender : this.username,
            reciver : this.friendname,
            title : text,
            date_sent : date_sent,
            date_received : "",
            fileName : "",
            Thumbnail :"",
            Downloaded : false,
            sent : false,
            delivered : false,
            readed : false,
            Path1 : "",
            Path2 : "",
            Deleted : false,
            Record : -1
          }
      }
      this.addMessage(msg.data);
      WebsocketService.sendRequest(msg);
      WebsocketService.messageID++;
    }
  }

  sendFile() : void{
    let files = this.element.nativeElement.querySelector('#upload').files;
    let file = files[0];
    let formData = new FormData();
    formData.append('selectFile' , this.imageAfterCompress , file.name);
    let date;
    let url = "http://localhost:8000/"+this.username+"/"+this.friendname;
    this.fileUploader.upploadFile(formData,url).subscribe(res => {
      console.log("file uploaded");
      //send Thumbnail
      date = Date().toString();
      let datapipe = new DatePipe("en-US");
      date = datapipe.transform(date , 'h:mm a');
      let msg = {
        type : 'image_message',
          data : {
            type : 'image_message',
            ID1 : WebsocketService.messageID,
            ID2 : -1,
            sender : this.username,
            reciver : this.friendname,
            title : "",
            date_sent  : date,
            date_received : "",
            fileName : file.name,
            Thumbnail :this.imagePreview,
            Downloaded : false,
            sent : false,
            delivered : false,
            readed : false,
            Path1 : "",
            Path2 : "",
            Deleted : false,
            Record : -1
          }
      };
      let ext= (file.name as string).split('.').pop().toLowerCase();
      if (!(ext == "jpg" || ext == "png" || ext == "bmp" || ext == "gif"))
      {
        msg.type = "file_message";
        msg.data.type = "file_message";
      }
      this.addMessage(msg.data);
      WebsocketService.sendRequest(msg);
      this.image_sent = "";
      this.imagePreview = "";
      console.log(file.name + "fillllll");
      WebsocketService.messageID++;
    });
  }

  getLastRecords(){
    let chat_history = ChatService.history.get(this.friendname);
    if (chat_history)
    {
      let size = chat_history.length;
      for (let i=0;i<size;i++)
      this.websocketService.get_Messages(this.friendname , i);
    }
    else
      this.websocketService.get_Messages(this.friendname , 0);
  }

  addMessage(data){
    let htmlMessage : HTMLElement;

    if(data.type == "image_message")
    {
      htmlMessage = this.insertImage(data.date_sent);
      let This = this;
      htmlMessage.addEventListener("click",function(){
        WebsocketService.handleClickMessage(This.username , This.friendname,data , htmlMessage);
      });
    }
    else
    {
      htmlMessage = this.insertMessage(data.title , data.date_sent);
      let This = this;
      htmlMessage.addEventListener("click",function(){
        WebsocketService.handleClickMessage(This.username , This.friendname,data , htmlMessage);
      });
    }

    let msg_size = JSON.stringify(data).length;
    let chat_history = ChatService.history.get(this.friendname);
    let message = {
      data : data,
      html : htmlMessage,
      ID : data.ID1
    }

    if (!chat_history)
    {
      let temp : Record[] = [];
      let newRecord :Record = {
        messages : [] ,
        size : 0
      };

      newRecord.messages.unshift(message);
      newRecord.size += msg_size;
      temp.unshift(newRecord);
      ChatService.history.set(this.friendname , temp);
    }
    else
    {
      if (chat_history[0].size + msg_size > 1000){
        let newRecord :Record = {
          messages : [] ,
          size : 0
        };
        newRecord.messages.unshift(message);
        //add record at the beginning of the array
        chat_history.unshift(newRecord);
      }
      else
      {
        chat_history[0].messages.unshift(message);
      }
        chat_history[0].size += msg_size;
    }
  }

  compressImage(file) : void{
    //compress the image using package called (ng2ImgMax) and converting it to string
    this.ng2ImgMax.compressImage(file, 0.200).subscribe(
      result => {
        this.uploadedImage = new File([result], result.name);
        const reader: FileReader = new FileReader();
        this.imageAfterCompress = this.uploadedImage;
        reader.readAsDataURL(file); // convert image to string url using base64 encoding
        reader.onload = () => {
          this.image_sent = reader.result; //image as string url
        };
      },
      error => {
        console.log('😢 Oh no!', error);
      }
    );

    this.ng2ImgMax.resizeImage(file,64,64).subscribe(
      result => {
        this.uploadedImage = new File([result], result.name);
        
        this.getImagePreview(this.uploadedImage);
      },
      error => {
        console.log('😢 Oh no!', error);
      }
    );
  }

  start_private_chat()
  {
    WebsocketService.sendRequest({
      type : "start_private_chat",
      data : {
        username1 : this.username,
        username2 : this.friendname
      }
    });
  }

  @HostListener('scroll', ['$event'])
  onScroll(event) {
    let scrollHeight = event.target.scrollTop;
    if(scrollHeight == 0)
    {
      //send request to get old messages
      WebsocketService.sendRequest({
        type : "chat_history",
        data : {
          username1 : this.username,
          username2 : this.friendname,
          indx : ChatService.recordIndex++
        }
      });
      console.log("message index is "+  ChatService.recordIndex);
    }
  }

  block(Button){
    if (this.blocked){
      Button.value = "Unblock";
      /* WebsocketService.sendRequest({
        type : "UnBlock",
        data : {
          username1 : this.username,
          username2 : this.friendname
        }
      }) */
    }
    else
    {
      this.blocked = true;
      this.disableForm();
      Button.value = "Unblock";
      WebsocketService.sendRequest({
        type : "block",
        data : {
          username1 : this.username,
          username2 : this.friendname
        }
      })
    }
  }

  clearHistory(){
    WebsocketService.sendRequest({
      type : "clear_history",
      data : {
        username1 : this.username,
        username2 : this.friendname
      }
    })
  }

  disableForm(){
    //$("#messagebox :input").prop('readonly',true);
    //$("#messagebox > button").prop('readonly',true);
    let form = this.element.nativeElement.querySelector("#messagebox");
    let elements = form.elements;
    for(let i=0;i<elements.length;i++){
      elements[i].disabled = true;
    }
  }

  /* startE2EE(){
    let p , g;
    let keyPair = new DHKE(p,g);
    keyPair.GenerateKeys(1024 , function(){
        let publicKey=keyPair.GetPublicKey();
        let req = {
            type : "start_e2ee",
            data : {
                sender : "username" ,
                reciver : "username" ,
                publicKey : publicKey
            }
        }
        WebsocketService.sendRequest(req);
    })
  } */
}
