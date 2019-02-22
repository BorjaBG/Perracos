import { FormularioPage } from './../formulario/formulario.page';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';


import leaflet from 'leaflet';
import * as L from 'leaflet';
import 'leaflet.locatecontrol';

declare var ol: any;
declare var map: any;
import 'leaflet-routing-machine';
import 'leaflet-easybutton';
import { getOrCreateCurrentQueries } from '@angular/core/src/render3/state';
var flag : boolean = false;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage  implements OnInit{
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  formularioP = FormularioPage;
 
  constructor(private route: ActivatedRoute,private router:Router, private nav: NavController, private loadingController: LoadingController, private alertCtrl: AlertController) { }
 Actionformulario(){
  if (flag == true) {
    this.router.navigateByUrl('/formulario');
  }
  
  }

  ngOnInit() {
    
  }


  ionViewDidEnter() {
    this.loadmap();
  }
 
  loadmap() {
    
    this.map = new leaflet.map("map").fitWorld( );

    leaflet.control.scale().addTo(this.map);

    leaflet.tileLayer('https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=8a579859eda74a3bab08b97aa36c56ad', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(this.map);

    var toggle = leaflet.easyButton({
      states: [{
          icon: '<ion-icon class="star" name="flag"></ion-icon>',
          stateName: 'check-mark',
          onClick: function(btn,map) {
              btn.button.style.backgroundColor = 'blue';
              btn.state('x-mark');
              flag = true;
          }
      }, {
          icon: '<ion-icon class="star" name="flag"></ion-icon>',
          stateName: 'x-mark',
          onClick: function(btn,map) {
              flag = false;
              btn.button.style.backgroundColor = 'white';
              btn.state('check-mark');
          }
      }]
  });

  toggle.button.style.transitionDuration = '.3s';
  toggle.addTo(this.map);

   

    /*.on('locationfound', (e) => {
      let markerGroup = leaflet.featureGroup();
      let marker: any = leaflet.marker([e.latitude, e.longitude]).on('click', () => {
        map.setView([e.latitude,e.longitude], 13);
      
      })
      }).on('locationerror', (err) => {
        alert(err.message);
    })*/


  
     var lc = L.control.locate({
      flyTo: true,
      showPopup:false,
      clickBehavior: {inView: 'start'}
  }).addTo(this.map);

      lc.start();

    this.map.locate({
      setView: true,
      maxZoom: 50
    }).on('locationfound', (e) => {
     /* let markerGroup = leaflet.featureGroup();
      let marker: any = leaflet.marker([e.latitude, e.longitude]).on('click', () => {
      })
      markerGroup.addLayer(marker);
      marker.bindPopup("<b>Posicion actual</b>").openPopup();
      this.map.addLayer(markerGroup);*/
      }).on('locationerror', (err) => {
        alert(err.message);
    })    
  }
  
}