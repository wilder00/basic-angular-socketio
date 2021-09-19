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
      console.log('Conectado al servidor');
      this.socketStatus = true;
    })
    
    this.socket.on('disconnect', ()=>{
      console.log('desconectado del servidor');
      this.socketStatus = false;
    })
  }
}
