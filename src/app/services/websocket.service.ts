import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { ChatService, Record } from './chat.service';
import { XoService } from './xo.service';
import { FileUploadService } from './file-upload.service';
import { error } from '../../../node_modules/protractor';
import 'rxjs/add/operator/map';
import { DatePipe } from '../../../node_modules/@angular/common';

@Injectable()
export class WebsocketService {

    static url : string = 'ws://192.168.43.64:3000';
    static http_url :string = 'http://192.168.43.64:8000/';
    static ws : WebSocket;// = new WebSocket(WebsocketService.url);
    static messageID : number = 0;
    public static searchResults : string[];

    static handleClickMessage = function handleClickMessage(username1:string , username2:string , msg:any , btn){
        let ID1 = msg.ID2;
        let ID2 = msg.ID1;
        let Record = msg.Record;
        let Deleted = msg.Deleted;

        let req = {
            type:"",
            data:{
                username1: username1,
                username2: username2,
                ID1 : ID1,
                ID2 : ID2,
                Record : Record
            }
        };

        if (btn.style.opacity != "0.7")
        {
            btn.style.opacity = "0.7"
            let button1 = document.createElement("button");
            let button2 = document.createElement("button");

            button1.innerHTML = "delete for me";
            button2.innerHTML = "delete for everyone";

            button1.addEventListener("click",function(){
                req.type = "delete_forme";
                if (!Deleted)
                WebsocketService.sendRequest(req);
            });
            button2.addEventListener("click",function(){
                req.type = "delete_foreveryone";
                if (!Deleted)
                WebsocketService.sendRequest(req);
            });

            btn.appendChild(button1);
            btn.appendChild(button2);
        }
        else
        {
            btn.style.opacity = "1";
            btn.removeChild(btn.lastChild);
            btn.removeChild(btn.lastChild);
        }
        return function(e){
            console.log("clicked");
        }
    };

    constructor(private router :Router , private fileUploadService :FileUploadService) {
        WebsocketService.searchResults = [];
    }

    public connect(){
        let websocketService = this;

        WebsocketService.ws = new WebSocket(WebsocketService.url);
        
        WebsocketService.ws.onopen = function(){
          
        };
        
        WebsocketService.ws.onmessage = function(msg){
            websocketService.HandleEvent(msg);
        };
        WebsocketService.ws.onerror = function(error){
            console.log(error);
        }
    
        WebsocketService.ws.onclose = function(){
            console.log('the connection is done....');
        }
    }

    public static sendRequest(message : any) : void {
        WebsocketService.ws.send(JSON.stringify(message));
    }

    public HandleEvent(msg : MessageEvent){
        console.log(msg);
        let message = JSON.parse(msg.data);
        let data = message.data;
        let type = message.type;
        console.log(message);
        switch (type)
        {
            case 'login':
            {
                this.Login(data);
                break;
            }
            case 'signup':
            {
                this.signup(data.verdict);
                break;
            }
            case 'text_message':
            {
                this.recieveText(data);
                break;
            }
            case 'image_message' :
            {
                this.recieveImage(data);
                break;
            }
            case 'file_message':
            {
                this.receiveFile(data);
                break;
            }
            case 'chat_list':
            {
                this.recieveChatList(data);
                break;
            }
            case 'friends_list':
            {
                this.recieveFriendsList(data);
                break;
            }
            case 'chat_history':
            {
                this.recieveChatHistory(data);
                break;
            }
            case 'match_search':
            {
                this.match_search(data);
                break;
            }
            case 'disconnect':
            {
                break;
            }
            case 'search':
            {
                break;
            }
            case 'StartGame_XO':
            {
                this.StartGame_XO(data);
                break;
            }
            case 'Game_XO':
            {
                this.Game_XO(data);
                break;
            }
            case 'send_report':
            {
                this.send_report(data);
                break;
            }
            case 'delivery_report':
            {
                this.delivery_report(data);
                break;
            }
            case 'read_report':
            {
                this.read_report(data);
                break;
            }

            case 'delete_message':
            {
                this.delete_message(data);
                break;
            }
            case 'add_freind':
            {
                this.Add_friend(message.Res , message.User);
                break;
            }
            case 'clear_history':
            {
                this.clear_history(data);
                break;
            }
            case 'block':
            {
                this.block(data);
                break;
            }
            case 'unblock':
            {
                this.UnBlock(data);
                break;
            }
            case 'startE2EE':
            {
                //this.receiveStartE2EE(data);
                break;
            }
            case 'acceptE2EE':
            {
                //this.receiveAcceptE2EE(data);
                break;
            }
            default :
            {
                break;
            }
        }
    }

    public Login(data :any){
        if (data.statue)
        {
            UserService.set_UserLogin();
            WebsocketService.messageID = data.ID;
            console.log(WebsocketService.messageID);
            this.router.navigate(["/"+ UserService.username]);
        }
        else
        {
            //navigate user to login
            this.router.navigate(["/login"]);
            console.log("login failed");
        }
    }

    public signup(verdict :boolean){
        if (verdict)
        {
            UserService.set_UserSignUp();
            //navigate user to login page
            this.router.navigate(["/login"]);
            console.log("sign up is work");
            alert("register successeded");
        }
        else
        {
            //navigate user to signup page
            this.router.navigate(["/register"]);
            alert("register failed");
        }
    }

    public recieveText(data :any){
        if (data)
        {
            let title = data.title;
            let date_sent = data.date_sent;
            let date = Date().toString();
            let datapipe = new DatePipe("en-US");
            let date_received = datapipe.transform(date , 'h:mm a');
            let sender = data.sender;
            let reciver = data.reciver;
            let Deleted = data.Deleted;

            data.ID2 = data.ID1;
            data.ID1 = WebsocketService.messageID;

            //recieve message from person who don't exist in chats
            let index = UserService.chats.indexOf(sender);
            if (index < 0){
                UserService.chats.push(sender);
            }
            //-------------------------------

            let report = {
                type : "",
                data : {
                    sender : sender,
                    reciver: reciver,
                    date_received : date_received,
                    ID1 : data.ID1,
                    ID2 : data.ID2,
                    Record : data.Record
                }
            }
            //let temp = data.ID2;

            let div = document.createElement('div'),
                span = document.createElement('span');

            div.innerText = title;
            span.innerText = date_sent;
            div.setAttribute("class","card bg-light mb-3 offset-1 col-4");
            span.setAttribute("class","time");
            div.appendChild(span);
            
            if (this.router.url == ("/"+reciver + "/chats/"+sender))
            {
                report.type = "delivery_report";
                WebsocketService.sendRequest(report);
                report.type = "read_report";
                WebsocketService.sendRequest(report);

                if (title)
                {
                    let chatscreen = document.querySelector("#chatscreen");
                    chatscreen.appendChild(div);
                    chatscreen.scrollTo(0 , chatscreen.scrollHeight);
                }
            }
            else
            {
                report.type = "delivery_report";
                WebsocketService.sendRequest(report);
            }
            console.log("url "+ this.router.url)
            this.addMessage(data , div);
            WebsocketService.messageID++;
        }
    }

    public recieveImage(data :any){
        if (data)
        {
            let title = data.title;
            let Thumbnail = data.Thumbnail;
            let date_sent = data.date_sent;
            let sender = data.sender;
            let reciver = data.reciver;
            let fileName = data.fileName;
            //current time
            let date = Date().toString();
            let datapipe = new DatePipe("en-US");
            let date_received = datapipe.transform(date , 'h:mm a');
            let Deleted = data.Deleted;
            let Record = data.Record;

            data.ID2 = data.ID1;
            data.ID1 = WebsocketService.messageID;

            let report = {
                type : "",
                data : {
                    sender : data.sender,
                    reciver: data.reciver,
                    date_received : date_received,
                    ID1 : data.ID1,
                    ID2 : data.ID2,
                    Record : data.Record
                }
            };

            let div = document.createElement('div'),
                span = document.createElement('span'),
                recievedImg = document.createElement('img');

            recievedImg.setAttribute('src',Thumbnail);
            recievedImg.setAttribute("width","100%");

            span.setAttribute("class","time");
            span.innerText = date_sent;

            div.setAttribute("class","card bg-light mb-3 offset-1 col-6");
            div.style.padding = "0";
            div.innerHTML += recievedImg.outerHTML;
            div.appendChild(span);

            if (this.router.url == ("/"+reciver + "/chats/"+sender))
            {
                report.type = "delivery_report";
                WebsocketService.sendRequest(report);
                report.type = "read_report";
                WebsocketService.sendRequest(report);

                if (Thumbnail)
                {
                    let chatscreen = document.querySelector("#chatscreen");
                    chatscreen.appendChild(div);
                    chatscreen.scrollBy(0 , chatscreen.scrollHeight);
                }
            }
            else
            {
                report.type = "delivery_report";
                WebsocketService.sendRequest(report);
            }
            this.addMessage(data , div);
            WebsocketService.messageID++;

            //console.log(title);
            if (fileName)
            {
                let url = WebsocketService.http_url + sender +"/"+reciver+"/"+fileName;
                this.fileUploadService.getFilesList(url).map(res =>{
                    return {
                      filename: fileName,
                      data: res.blob()
                    };
                  }).subscribe(res =>{
                        var url = window.URL.createObjectURL(res.data);
                        var a = document.createElement('a');
                        document.body.appendChild(a);
                        a.setAttribute('style', 'display: none');
                        a.href = url;
                        a.download = res.filename;
                        a.click();
                        window.URL.revokeObjectURL(url);
                        a.remove(); // remove the element
                        }
                    );
            }
        }
    }

    public receiveFile(data)
    {
        this.recieveImage(data);
    }

    public recieveChatList(data :any){
        if (data.statue)
        {
            UserService.chats = data.data;

            UserService.chats.forEach(chat => {
                WebsocketService.sendRequest({
                    type : "chat_history",
                    data : {
                      username1 : UserService.username,
                      username2 : chat,
                      indx : 0
                    }
                });
            });
        }
        else
        {
            //handle operation failed
        }
    }

    public recieveFriendsList(data : any){
        if (data.statue)
        {
            UserService.friends = data.data;
            console.log(UserService.friends);
            /* if (UserService.friends && UserService.chats)
            this.router.navigate(["/"+ UserService.username + "/chats"]); */
        }
        else
        {
            //handle operation failed
        }
    }
    public recieveChatHistory(data : any){
        console.log(data)
        if (data.statue)
        {
            //chat name and massages
            let user = data.User;
            //get user Records to update it
            let chatHistory : Record[] = ChatService.history.get(user);

            let temp : any[] = (data.data).reverse();
            console.log(temp);
            let messages : any[] = this.storeMessages(temp);

            let record : Record = {
                messages : messages,
                size : 0
            };

            record.size = this.calcSizeOfRecord(record);

            if (chatHistory)
            {
                chatHistory.push(record);
                ChatService.history.set(user , chatHistory);
                this.get_Messages(user , chatHistory.length-1);
            }
            else
            {
                //if chatHistory is undefine
                //means this record has index of 0 
                chatHistory= [];
                chatHistory.push(record);
                ChatService.history.set(user , chatHistory);
                this.router.navigate(["/"+ UserService.username + "/chats"]);
            }
        }
        else
        {
            //handle operation failed
            if (this.router.url == ("/"+UserService.username))
            this.router.navigate(["/"+ UserService.username + "/chats"]);
        }
    }
    public match_search(data : any){
        if (data.statue)
        {
            WebsocketService.searchResults = data.data;
            WebsocketService.showSearchResults();
        }
        else
        {
            //handle operation failed
        }
    }
    public StartGame_XO(data : any){
        //ask for play
        let Data = data.data;
        let sender = Data.sender;
        let This = this;
        $('#gameAlert #accept').click(function(){
            This.router.navigate(['/'+UserService.username+'/game/tic-tac-toe/'+sender]);
        })
        $("#cover").css("display","block");
        $('#gameAlert').show(500);
    }
    public Game_XO(data : any){
        let Data = data.data;
        let i = Data.i,
            j = Data.j,
            symbol = Data.symbol,
            temp=[],grid=[],k=0;
        
        XoService.visited[i][j] = 1;

        if (symbol == "X")
        {
            XoService.Mysymbol = "O";
            XoService.Enemysymbol = "X";
        }
        else
        {
            XoService.Mysymbol = "X";
            XoService.Enemysymbol = "O";
        }

        let boxes = document.getElementsByClassName("box");
        for(let i=0;i<boxes.length;i++){
            temp.push(boxes[i]);
            k++;
            if (k==3){
                grid.push(temp);
                k=0;
                temp = [];
            }
        }
        let box = $(grid[i][j]); 
        box.css("color","#163172");
        box.css("background-color","#D6E4F0");
        box.text(symbol);
        XoService.checkWinner();
        XoService.enableBoxes();
    }

    public send_report(data : any){
        
        let sender = data.sender,
            reciver = data.reciver,
            date_received = data.date_received,
            ID1 = data.ID1,
            ID2 = data.ID2,
            Record = data.Record;

        let chatHistory = ChatService.history.get(reciver);
        let flag = false;
        //search for ID of message
        for (let i=0;i<chatHistory.length;i++){
            for(let j=0;j<chatHistory[i].messages.length;j++){
                let msg = chatHistory[i].messages[j],
                    Data = msg.data,
                    html = msg.html as HTMLElement;

                if (msg.ID == ID1)
                {
                    if (Data.type == "text_message")
                    {
                        let div = html.children[0];
                        let status = div.children[1];
                        Data.sent = true;
                        Data.Record = Record;
                        if (!Data.Deleted)
                        (status as HTMLImageElement).src = "../../assets/icons/send.png";
                        flag = true;
                        break;
                    }
                    else
                    {
                        let div = html.children[1];
                        let status = div.children[1];
                        Data.sent = true;
                        Data.Record = Record;
                        if (!Data.Deleted)
                        (status as HTMLImageElement).src = "../../assets/icons/send.png";
                        flag = true;
                        break;
                    }
                }
            }
            if (flag) break;
        }
    }

    public delivery_report(data : any){
        
        let sender = data.sender,
            reciver = data.reciver,
            date_received = data.date_received,
            ID1 = data.ID1,
            ID2 = data.ID2;

        let chatHistory = ChatService.history.get(reciver);
        let flag = false;
        //search for ID of message
        if (chatHistory)
        {
            for (let i=0;i<chatHistory.length;i++){
                for(let j=0;j<chatHistory[i].messages.length;j++){
                    let msg = chatHistory[i].messages[j],
                        Data = msg.data,
                        html = msg.html as HTMLElement;

                    if (msg.ID == ID2)
                    {
                        if (Data.type == "text_message")
                        {
                            let div = html.children[0];
                            let status = div.children[1];
                            Data.delivered = true;
                            Data.ID2 = ID1;
                            if (!Data.Deleted)
                            (status as HTMLImageElement).src = "../../assets/icons/receive.png";
                            console.log(status);
                            flag = true;
                            break;
                        }
                        else
                        {
                            let div = html.children[1];
                            let status = div.children[1];
                            Data.delivered = true;
                            Data.ID2 = ID1;
                            if (!Data.Deleted)
                            (status as HTMLImageElement).src = "../../assets/icons/receive.png";
                            console.log(status);
                            flag = true;
                            break;
                        }
                    }
                }
                if (flag) break;
            }
        }
        //------------------------------------------------------
    }

    public read_report(data : any){
        let sender = data.sender,
            reciver = data.reciver,
            date_received = data.date_received,
            ID1 = data.ID1,
            ID2 = data.ID2;

        let chatHistory = ChatService.history.get(reciver);
        let flag = false;
        //search for ID of message
        if (chatHistory)
        {
            for (let i=0;i<chatHistory.length;i++){
                for(let j=0;j<chatHistory[i].messages.length;j++){
                    let msg = chatHistory[i].messages[j],
                        Data = msg.data,
                        html = msg.html as HTMLElement;

                    if (msg.ID == ID2)
                    {
                        if (Data.type == "text_message")
                        {
                            let div = html.children[0];
                            let status = div.children[1];
                            Data.readed = true;
                            if (!Data.Deleted)
                            (status as HTMLImageElement).src = "../../assets/icons/read.png";
                            flag = true;
                            break;
                        }
                        else
                        {
                            console.log(html.children.length);
                            let div = html.children[1];
                            let status = div.children[1];
                            console.log(status);
                            if (!Data.Deleted)
                            Data.readed = true;
                            (status as HTMLImageElement).src = "../../assets/icons/read.png";
                            flag = true;
                            break;
                        }
                    }
                }
                if (flag) break;
            }
        }
        //------------------------------------------------------
    }

    public delete_message(data : any){
        let username1 = data.username1;
        let username2 = data.username2;
        let ID1 = data.ID1;
        let ID2 = data.ID2;

        let chatHistory = [];
        if (username1 == UserService.username)
            chatHistory = ChatService.history.get(username2);
        else
            chatHistory = ChatService.history.get(username1);
        
            let flag = false;
            //search for ID of message
            if (chatHistory)
            {
                for (let i=0;i<chatHistory.length;i++){
                    for(let j=0;j<chatHistory[i].messages.length;j++){
                        let msg = chatHistory[i].messages[j],
                            Data = msg.data,
                            html = msg.html as HTMLElement;
                        console.log(msg.ID , " ", ID2);
                        if (msg.ID == ID2)
                        {
                            Data.Deleted = true;
                            Data.title = "this message has been deleted..!!";
                            while (html.firstChild) {
                                html.removeChild(html.firstChild);
                            }
                            html.innerText = "this message has been deleted..!!";
                            console.log("this message has been deleted..!!");
                        }
                    }
                }
            }
    }

    public clear_history(data : any){
        let username1 = data.username1;
        let username2 = data.username2;
        let Res = data.Res;

        if (Res){
            let chatHistory = ChatService.history.get(username2);
            chatHistory.splice(0,chatHistory.length);
            let chatscreen = document.querySelector("#chatscreen");
            while (chatscreen.firstChild) {
                chatscreen.removeChild(chatscreen.firstChild);
            }
        }
        else
        {
            alert("clear is failed");
        }
    }

    public Add_friend(Res , User){
        if (Res)
        {
            UserService.friends.push(User);
        }
    }

    public block(data : any){
        let Res = data.Res;
        let username1 = data.username1;

        if (Res){
            //block success
            console.log("block success");
            UserService.addToBlockList(username1);
        }
        else{
            console.log("block failed")
        }
    }

    public UnBlock(data : any){

    }

    public calcSizeOfRecord(record :Record){
        let messages = record.messages;
        let size = 0;
        messages.forEach(message => {
            let msg_size = JSON.stringify(message.data).length;
            size += msg_size;
        });
        return size;
    }

    public addMessage(data , htmlMessage : HTMLElement){
        let msg_size = JSON.stringify(data).length;
        let sender = data.sender;
        let reciver = data.reciver;
        let chat_history = ChatService.history.get(sender);

        if (sender == UserService.username)
        htmlMessage.addEventListener("click",function(){
            WebsocketService.handleClickMessage(sender,reciver,data,htmlMessage);
        });
        else if (reciver == UserService.username)
        htmlMessage.addEventListener("click",function(){
            WebsocketService.handleClickMessage(reciver,sender,data,htmlMessage);
        });

        let message = {
            data : data,
            html : htmlMessage,
            ID : data.ID1
        };

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
            ChatService.history.set(sender , temp);
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

    public downloadFile(data){
        var blob = new Blob([data], { type: 'text/csv' });
        var url= window.URL.createObjectURL(blob);
        window.open(url);
    }

    public get_Messages(chatname : string ,recordIndex : number){
    let chatHistory = ChatService.history.get(chatname);
    if(chatHistory)
    {
      let chatMessages = chatHistory[recordIndex].messages;
      let chatscreen = $("#chatscreen");
    
      chatMessages.forEach(element => {
        let sender = element.data.sender ,
            reciver = element.data.reciver ,
            date_received = element.data.date_received,
            ID1 = element.data.ID1,
            ID2 = element.data.ID2,
            Record = element.data.Record;

        if (reciver == UserService.username)
        {
          let report = {
            type : "read_report",
            data : {
                sender : sender,
                reciver: reciver,
                date_received : date_received,
                ID1 : ID1,
                ID2 : ID2,
                Record : Record
            }
          }
          WebsocketService.sendRequest(report);
        }
        chatscreen.prepend(element.html);
      });
    }
    }

    storeMessages(Data : any[]){

        let messages : any[] = [];
        let Temp : any[] = [];
        for(let i = Data.length-1 ; i >=0 ; i--){
            let data = Data[i];
            let sender = data.sender ,
            reciver = data.reciver ,
            title = data.title ,
            Thumbnail = data.Thumbnail,
            date_sent = data.date_sent,
            date_received = data.date_received,
            delivered = data.delivered,
            sent = data.sent,
            Downloaded = data.Downloaded,
            readed = data.readed,
            ID1 = data.ID1,
            ID2 = data.ID2,
            div = document.createElement('div'),
            div2 = document.createElement('div'),
            status = document.createElement('img'),
            span = document.createElement('span');

            if (data.type =="image_message"){
                if (data.Deleted){
                    div.innerText = title;
                }
                else
                {
                    let img = document.createElement("img");
                    img.setAttribute('src',Thumbnail);
                    div.style.padding = "0px";
                    img.setAttribute("width","100%");
                    div.appendChild(img);
                }
            }
            else if (data.type =="text_message")
            {
                div.innerText = title;
            }

            if (sender == UserService.username)
            {
                if (data.type =="text_message")
                div.setAttribute("class","card text-white bg-secondary mb-3 offset-7 col-4");
                else
                {
                    div.setAttribute("class","card text-white bg-secondary mb-3 offset-5 col-6");
                }

                div.addEventListener("click",function(){
                    WebsocketService.handleClickMessage(sender,reciver,data,div);
                });
                if (!data.Deleted)
                {
                    if (readed)
                    {
                        status.src = "../../assets/icons/read.png";
                    }
                    else if (delivered)
                    {
                        status.src = "../../assets/icons/receive.png";
                    }
                    else if (sent)
                    {
                        status.src = "../../assets/icons/send.png";
                    }
                    else
                    {
                        status.src = "../../assets/icons/wait2.png";
                    }
                }
            }
            
            else if (reciver == UserService.username)
            {
                if (data.type =="text_message")
                div.setAttribute("class","card bg-light mb-3 offset-1 col-4");
                else
                div.setAttribute("class","card bg-light mb-3 offset-1 col-6");

                div.addEventListener("click",function(){
                    WebsocketService.handleClickMessage(reciver,sender,data ,div);
                });

                if (!delivered){
                    let date = Date().toString();
                    let datapipe = new DatePipe("en-US");
                    date_received = datapipe.transform(date , 'h:mm a');

                    data.ID2 = data.ID1;
                    data.ID1 = WebsocketService.messageID;

                    let report = {
                        type : "delivery_report",
                        data : {
                            sender : sender,
                            reciver: reciver,
                            date_received : date_received,
                            ID1 : data.ID1,
                            ID2 : data.ID2,
                            Record : data.Record
                        }
                    }

                    WebsocketService.sendRequest(report);
                    WebsocketService.messageID++; 
                }
                
            }
            span.innerText = date_sent;
            span.setAttribute("class","time");
            div2.appendChild(span);
            div2.appendChild(status);
            div.appendChild(div2);

            let message = {
                data : data,
                html : div,
                ID : data.ID1
            }
            messages.push(message);
        }
        return messages.reverse();
    }

    public static showSearchResults(){
        let resultScreen = $("#results");
        this.searchResults.forEach(user => {
          let a = document.createElement("a") ,
              div1 = document.createElement("div"),
              div2 = document.createElement("div"),
              div3 = document.createElement("div"),
              h5 = document.createElement("h5"),
              button = document.createElement("button");
          div1.className = "friend";
          div2.className = "photo";
          div3.className = "details";
          div2.style.backgroundImage = "url('../../assets/images/image1.jpg')";
          
          h5.innerText = user;
          button.innerText = "Add Friend";
          button.className = "btn btn-primary";
          button.addEventListener("click",function(){
            WebsocketService.sendRequest({
              type : "add_freind",
              data : {
                  username1 : UserService.username,
                  username2 : user
              }
              
            });
          });
          div3.appendChild(h5);
          div3.appendChild(button);
          div1.appendChild(div2);
          div1.appendChild(div3);
          a.appendChild(div1);
          resultScreen.append(a);
        });
    }

    /* public receiveStartE2EE(data){
        let p , g;
        let sender = data.sender; //him
        let OtherPublicKey = data.publicKey;
    
        let keyPair = new DHKE(p , g);
        keyPair.GenerateKeys(1024 , function(){
            let publicKey=keyPair.GetPublicKey();
            let sharedSecret=keyPair.ComputeSecret(OtherPublicKey);
            UserService.addToE2EE(sender , sharedSecret)
        });
        
    
        let req = {
            type : "acceptE2EE",
            data :{
                publicKey : keyPair.GetPublicKey(),
                sernder : "", //me
                reciver : "" //him
            }
        }
        WebsocketService.sendRequest(req);
    }

    public receiveAcceptE2EE(data){
        let publicKey = data.publicKey;
        // let sender = data.se
    } */

}
