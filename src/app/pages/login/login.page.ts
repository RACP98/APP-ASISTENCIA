import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  mdl_user: string = '';  
  mdl_pswd: string = '';  
  cantidad: string = ''; 
  message: string = '';
  warningVisible: boolean = false;
  loadingVisible: boolean = false;

  constructor(private router: Router, private db: DbService, private api: ApiService) { }

  ngOnInit() {
    this.warningVisible = false;
    this.loadingVisible = false;
  }

  registro() {
    this.router.navigate(['registro'], { replaceUrl: true });
  }

  login() {
    this.warningVisible = false;
    this.loadingVisible = true; 
    setTimeout(async() => {
      let datos = this.api.login(this.mdl_user, this.mdl_pswd);
      let respuesta = await lastValueFrom(datos);
      let json_texto =JSON.stringify(respuesta);
      let json = JSON.parse(json_texto);
      if (json.status == "success") {
        this.message = json.message;
        this.router.navigate(['principal']);
        await this.db.almacenarSesion(json.usuario); 
        this.mdl_user = '';
        this.mdl_pswd = '';
        this.warningVisible = false;
        this.loadingVisible = false;  
      }else {
        console.log("RCP: Credenciales Invalidas");
        this.message = json.message;
        console.log("RCP: Status" + json.message)
        this.warningVisible = true;
        setTimeout(() => {
          this.warningVisible = false;
          this.loadingVisible = false;  
        }, 2000);
      }
    }, 1000);
  }



}
