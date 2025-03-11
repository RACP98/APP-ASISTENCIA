import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {
  nombre: string ='';
  correo: string ='';
  lista_sedes: any[] = [];
  codigo_texto: any[] = [];
  constructor(private router: Router, private db: DbService, private api: ApiService) { }

  async ngOnInit() {
    this.obtenerSede();
    const datos = await this.db.obtenerDatosLogeado();
    this.nombre = datos.nombre; 
    this.correo = datos.correo;   
    try {
      await BarcodeScanner.installGoogleBarcodeScannerModule();
    }catch (error) {
    }   
  }

  async obtenerSede() {
    this.lista_sedes = [];
    let datos = this.api.sedes();
    let respuesta: any = await lastValueFrom(datos);
    let json = respuesta[0]; 
    for (let x = 0; x < json.length; x++) {
      let sede: any = {};
      sede.nombre = json[x].NOMBRE;
      sede.direccion = json[x].DIRECCION;
      sede.telefono = json[x].TELEFONO;
      sede.horario = json[x].HORARIO_ATENCION;
      sede.imagen = json[x].IMAGEN;
      this.lista_sedes.push(sede);
    }
  }
  
  perfil() {
      this.router.navigate(['perfil']);
  }

  asistencia() {
    this.router.navigate(['asistencia']);
  }

  async cerrar() {
    await this.db.cerrar();
    this.router.navigate(['login']);
  }

  async leerQr() {
    let codigo_texto = await BarcodeScanner.scan();
    if(codigo_texto.barcodes.length > 0) {
      let resultado = codigo_texto.barcodes[0].displayValue.split('|');
      let siglas = resultado[0];
      let fecha =  resultado[2];
      let datos = this.api.marcarAsistencias(siglas, this.correo, fecha);
      let respuesta = await lastValueFrom(datos);
      let json_texto = JSON.stringify(respuesta);
      let json = JSON.parse(json_texto);
      console.log('RCP: 6 ' +json_texto);
        if (json.status == "success") {
          alert(json.message);
        }else {alert(json.message);}
    }else { 
      console.log("RCP: 5");
    }
  }
  
}
