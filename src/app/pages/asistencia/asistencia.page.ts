import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {
  correo: string =''; 
  asistencias: any[] = [];
  constructor(private router: Router, private db: DbService, private api: ApiService) { }

  async ngOnInit() {
    const datos = await this.db.obtenerDatosLogeado();
    this.correo = datos.correo;    
    this.obtenerAsistencias();
  }

  perfil() {
    this.router.navigate(['perfil']);
  }

  async obtenerAsistencias() {
    this.asistencias = [];
    let datos = this.api.asistencias(this.correo);
    let respuesta: any = await lastValueFrom(datos);
    let json = respuesta[0]; 
    for (let x = 0; x < json.length; x++) {
      let sede: any = {};
      sede.sigla = json[x].curso_sigla;
      sede.nombre = json[x].curso_nombre;
      sede.presente = json[x].presente;
      sede.ausente = json[x].ausente;
      let total = sede.presente + sede.ausente;
      sede.porcentaje = total > 0 ? (sede.presente / total) * 100 : 0;
      this.asistencias.push(sede);
    }
  }

  back() {
    this.router.navigate(['principal']);
  }
}
