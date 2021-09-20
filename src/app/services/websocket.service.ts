import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Usuario } from '../classes/usuario';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public socketStatus = false;
  public usuario!: Usuario | null;

  constructor(
    //[07] creamos una instancia del Socket, con solo declararlo ya tenemos conexion
    private socket: Socket,
    private router: Router,
  ) {
    this.cargarStorage();
    //[09] llamamos la funcion que crea los observables para verificar estados, solo se necesita que se llame una sola vez
    this.checkStatus();
    //[10] de aquí en adelante ya es solo consumir el socket (bueno, eso creo)
  }

  //[08] creamos las funciones que escucharán los eventos de conectado y desconectado
  checkStatus() {
    this.socket.on('connect', () => {
      console.log('---> Conectado al servidor');
      this.socketStatus = true;
      this.cargarStorage();
    })

    this.socket.on('disconnect', () => {
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
  emit(event: string, payload?: any, callback?: Function) {
    this.socket.emit(event, payload, callback)
  }


  listen(event: string) {
    return this.socket.fromEvent(event);
  }

  loginWS(nombre: string) {
    return new Promise((resolve, reject) => {
      this.emit('configurar-usuario', { nombre }, (resp: any) => {
        this.usuario = new Usuario(nombre);
        this.guardarStorage();
        resolve(resp);
      })
    })
  }

  logoutWS() {
    this.usuario = null;
    localStorage.removeItem('usuario');
    const payload = {
      nombre: 'sin-nombre'
    }
    this.emit('configurar-usuario', payload, () => { });
    this.router.navigateByUrl('');
  }

  getUsuario() {
    return this.usuario!;
  }

  guardarStorage() {
    localStorage.setItem('usuario', JSON.stringify(this.usuario))
  }

  cargarStorage() {
    if (localStorage.getItem('usuario')) {
      this.usuario = JSON.parse(localStorage.getItem('usuario')!)
      this.loginWS(this.usuario!.nombre)
    }
  }
}
