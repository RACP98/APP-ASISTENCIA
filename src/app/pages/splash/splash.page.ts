import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(private router:Router, private db:DbService) { }

  ngOnInit() {
    this.db.crearTablaSesion();
    setTimeout(async () => {
      let obtenerSesion = await this.db.obtenerSesion();
      if (obtenerSesion == "0") {
        this.router.navigate(['login']);
        console.log("RCP: sesion 0");
      }else {
        this.router.navigate(['principal']);
        console.log("RCP: sesion abierta");
      }
    }, 1500);
  }

}
