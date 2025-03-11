import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  ruta: string = 'https://www.s2-studio.cl';
  constructor(private http: HttpClient) { }

  crearUsuario(correo: string, contrasena: string, nombre: string, apellido: string, carrera: string) {
    let objeto: any = {};
    objeto.correo = correo;
    objeto.contrasena = contrasena;
    objeto.nombre = nombre;
    objeto.apellido = apellido,
    objeto.carrera = carrera;
    return this.http.post(this.ruta + '/api_duoc/usuario/usuario_almacenar', objeto).pipe();
  }

  login(correo: string, contrasena: string) {
    let objeto: any = {};
    objeto.correo = correo;
    objeto.contrasena = contrasena;
    return this.http.post(this.ruta + '/api_duoc/usuario/usuario_login', objeto).pipe();
  }

  modificar(correo: string, contrasena: string, carrera: string) {
    let objeto: any = {};
    objeto.correo = correo;
    objeto.contrasena = contrasena,
    objeto.carrera = carrera;
    return this.http.patch(this.ruta + '/api_duoc/usuario/usuario_modificar', objeto).pipe();
  }

  sedes() {
    return this.http.get(this.ruta + '/api_duoc/usuario/sedes_obtener').pipe();
  }

  asistencias(correo: string) {
    console.log("RCP: "+ correo);
    return this.http.get(this.ruta + '/api_duoc/usuario/asistencia_obtener/?correo=' + correo).pipe();
  }

  marcarAsistencias(siglas: string, correo: string, fecha: string) {
    let objeto: any = {};
    objeto.sigla = siglas,
    objeto.correo = correo;
    objeto.fecha = fecha;
    return this.http.post(this.ruta + '/api_duoc/usuario/marcar_asistencia', objeto).pipe();
  }

}
