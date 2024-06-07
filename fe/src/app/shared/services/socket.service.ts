import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
 
@Injectable()
export class SocketService {
 
    constructor(private socket: Socket) { }
 
    callNow(data: any){
    	console.log("socketservice :: callnow : data : ", data);
        this.socket.emit("call_now", data);
    }
    
    incomingCall() {
        return this.socket
            .fromEvent("incoming_call");
    }

    newMail() {
        return this.socket
            .fromEvent("new_mail");
    }
}