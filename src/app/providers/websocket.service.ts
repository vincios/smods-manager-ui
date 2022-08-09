import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { ModStatus, WebsocketMessage } from '../model/model';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
    subject = webSocket<WebsocketMessage<any>>('ws://localhost:5001');
    constructor() { console.log("WebsocketService: new instance") }

  subscribeForStatus(modId: string): Observable<ModStatus> {
    return this.subject.multiplex(
      () => ({ subscribe: {messageType: "status", modId: modId} }), // message for the server that someone started to listen for messages
      () => ({ unsubscribe: {messageType: "status", modId: modId} }), // message for the server that someone ended to listen for messages
      (message: WebsocketMessage<ModStatus>) => message.type === 'status' && message.channel === modId // message channel filtering
    ).pipe(
      map((message: WebsocketMessage<ModStatus>) => {
        return message.payload
      })
    )
  }
}
