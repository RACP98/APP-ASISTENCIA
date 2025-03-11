import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  mdl_mail: string = '';
  mdl_name: string = '';
  mdl_lastname: string = '';
  mdl_career: string = '';
  mdl_pass: string = '';
  mdl_confpass: string = '';
  message: string = '';
  warningVisible: boolean = false;
  loadingVisible: boolean = false;

  constructor(private router: Router, private api: ApiService) { }

  ngOnInit() {
   }

   registro() {
    this.warningVisible = false;
    this.loadingVisible = true; 
    setTimeout(async () => {
        let datos = this.api.crearUsuario(
          this.mdl_mail, 
          this.mdl_pass,
          this.mdl_name, 
          this.mdl_lastname, 
          this.mdl_career
        );
        let respuesta = await lastValueFrom(datos);
        let json_texto = JSON.stringify(respuesta);
        let json = JSON.parse(json_texto);
        if (json.status == "success") {
          this.message = json.message;
          this.router.navigate(['login']);
        } else {
        this.message = json.message;
        this.warningVisible = true;
        setTimeout(() => {
          this.warningVisible = false;
          this.loadingVisible = false;
        }, 2000);
      }
    }, 1000);
   }



  back() {
    this.router.navigate(['login']);
  }
}
