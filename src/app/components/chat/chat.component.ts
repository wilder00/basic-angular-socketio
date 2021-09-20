import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  texto: string = "";
  mensajesSubscription!: Subscription;
  element!: HTMLElement;

  mensajes: any[]= [];


  constructor(
    public chatService: ChatService,
  ) { }



  ngOnInit(): void {
    this.element = document.getElementById('chat-mensajes')!
    this.mensajesSubscription = this.chatService.getMessages().subscribe(msg=>{
      console.log(msg);
      this.mensajes.push(msg);

      setTimeout(() => {
        this.element.scrollTop = this.element.scrollHeight
      }, 50);

    })

  }

  enviar() {
    if( this.texto.trim().length === 0){
      return;
    }
    this.chatService.sendMessage(this.texto)
    this.texto= '';
    
  }

  ngOnDestroy(): void {
    this.mensajesSubscription.unsubscribe();
  }

}
