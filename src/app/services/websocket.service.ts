import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public socketStatus = false;
  constructor(
    //[07] creamos una instancia del Socket, con solo declararlo ya tenemos conexion
    private socket: Socket
  ) { 
    //[09] llamamos la funcion que crea los observables para verificar estados, solo se necesita que se llame una sola vez
    this.checkStatus();
    //[10] de aquí en adelante ya es solo consumir el socket (bueno, eso creo)
  }

  //[08] creamos las funciones que escucharán los eventos de conectado y desconectado
  checkStatus(){
    this.socket.on('connect', ()=>{
      console.log('---> Conectado al servidor');
      this.socketStatus = true;
    })
    
    this.socket.on('disconnect', ()=>{
      console.log('desconectado del servidor');
      this.socketStatus = false;
    })
  }


  /**
   * ### Emitir un Evento
   * 
   * @param event - el nombre del evento
   * @param payload - la información que quiero enviar
   * @param callback - la función que se quiere realizar después de que termine se ejecutar este trabajo evento
   */
  emit( event:string, payload?:any, callback?:Function ){
    this.socket.emit(event, payload, callback)
  }


  listen(event: string ){
    return this.socket.fromEvent(event);
  }

  loginWS( nombre: string ){
    this.emit('configurar-usuario',{ nombre }, (resp:any)=>{
      console.log(resp);
    })
  }
}
