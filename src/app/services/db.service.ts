import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { catchError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DbService {
private db:SQLiteObject | null =null;

  constructor(private sqlite: SQLite) { }

  async abrirDB() {
    this.db = await this.sqlite.create({
      name: "datos.db",
      location: "default"
    });
    console.log("RCP: Base de datos abierto OK")
  }

  async crearTablaSesion() {
    await this.abrirDB();
    await this.db?.executeSql("CREATE TABLE IF NOT EXISTS SESION (CORREO VARCHAR(50), NOMBRE VARCHAR(50), APELLIDO VARCHAR(50), CARRERA VARCHAR(50))",[]);
    console.log("RCP: Tabla SESION Creada OK");
  }

  async almacenarSesion(usuario: { correo: string, nombre: string, apellido: string, carrera: string }) {
    try {
      await this.abrirDB();
      await this.db?.executeSql("INSERT INTO SESION (correo, nombre, apellido, carrera) VALUES (?, ?, ?, ?)",
        [usuario.correo, usuario.nombre, usuario.apellido, usuario.carrera]
      );
      console.log("RCP: SESION Almacenado Correctamente");
    } catch (error) {
      console.log("RCP: Error al almacenar SESION: " + JSON.stringify(error));
    }
  }
  
  async obtenerSesion() {
    await this.abrirDB();
    let respuesta = await this.db?.executeSql("SELECT COUNT(CORREO) AS CANTIDAD FROM SESION",[]);
    return JSON.stringify(respuesta.rows.item(0).CANTIDAD);
  }

  async obtenerDatosLogeado() {
    await this.abrirDB();
    let respuesta = await this.db?.executeSql("SELECT NOMBRE, CORREO, CARRERA FROM SESION", []);
    if (respuesta.rows.length > 0) {
      return {nombre: respuesta.rows.item(0).NOMBRE,
              correo: respuesta.rows.item(0).CORREO,
              carrera: respuesta.rows.item(0).CARRERA};
    }return { nombre: null, correo: null, carrera: null };
  }
  
  async actualizar(carrera: string, correo: string) {
    await this.abrirDB();
    let respuesta = await this.db?.executeSql("UPDATE SESION SET CARRERA = ? WHERE CORREO = ?", [carrera, correo]);
  }

  async cerrar() {
    await this.abrirDB();
    let respuesta = await this.db?.executeSql("DELETE FROM SESION", []);
  }

}