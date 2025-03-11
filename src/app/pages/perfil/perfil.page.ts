import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  nombre: string ='';
  correo: string ='';
  mdl_career: string ='';
  mdl_pass: string ='';
  mdl_confpass: string ='';
  message: string = '';
  warningVisible: boolean = false;
  loadingVisible: boolean = false;
  constructor(private router: Router, private db: DbService , private api: ApiService ) { }

  async ngOnInit() {
    const datos = await this.db.obtenerDatosLogeado();
    this.nombre = datos.nombre;
    this.correo = datos.correo;
    this.mdl_career = datos.carrera;
  }
  
  
  cambiar() {
    this.warningVisible = false;
    this.loadingVisible = true; 
    setTimeout(async () => {
        let datos = this.api.modificar(
          this.correo, 
          this.mdl_pass,
          this.mdl_career
        );
        let respuesta = await lastValueFrom(datos);
        let json_texto = JSON.stringify(respuesta);
        let json = JSON.parse(json_texto);
        if (json.status == "success") {
          this.message = json.message;
          this.router.navigate(['principal']);
          this.db.actualizar(this.mdl_career, this.correo);
        } else {
        this.warningVisible = true;
        this.message = json.message;
        setTimeout(() => {
          this.warningVisible = false;
          this.loadingVisible = false;  
        }, 2000);
      }
    }, 1000);
   }


  back() {
      this.router.navigate(['principal']);
  }

}
