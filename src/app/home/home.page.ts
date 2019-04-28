
import { FormularioPage } from './../formulario/formulario.page';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Todo, TodoService } from '../services/todo.service';


import leaflet from 'leaflet';
import * as L from 'leaflet';
import 'leaflet.locatecontrol';


var markers = [];
import 'leaflet-routing-machine';
import 'leaflet-easybutton';
var flag : boolean = false;
var volver : boolean = false;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage  implements OnInit{
  @ViewChild('map') mapContainer: ElementRef;
  map: any;


  todos: Todo[];
 

  formularioP = FormularioPage;
 
  constructor( private todoService: TodoService, private route: ActivatedRoute,private router:Router, private nav: NavController, private loadingController: LoadingController, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  ionViewDidEnter() {

  
  console.log(volver);
  if(volver == true){
    this.loadpuntos();
  }
    this.todoService.getTodos().subscribe(res => {
      this.todos = res
      for (var i=0; i<res.length; i++) {
      markers.push([res[i].longitude,res[i].latitude,
       "<a href='/formulario' onclick='localStorage.setItem("+ 1 +", "+ res[i].longitude +");localStorage.setItem("+ 2 +", "+ res[i].latitude +");' class='button'>Formulario</a>"]);
      }
      this.loadmap();
    })
  }


  loadmap() {

    this.map = new leaflet.map("map").fitWorld( );

   

    this.map.on("click", (e)=> {
      if (flag == true){
      this.todoService.setMyGlobalVar(e.latlng.lng,e.latlng.lat);
      flag = false;
      volver = true;
      this.map.off();
      /*toggle.button.style.backgroundColor = 'white';
      toggle.state('check-mark');*/
      //this.map.remove();
      this.router.navigateByUrl('/formulario');

      }
    });

    leaflet.control.scale().addTo(this.map);

    leaflet.tileLayer('https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=8a579859eda74a3bab08b97aa36c56ad', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(this.map);

  
    var toggle = leaflet.easyButton({
      states: [{
          icon: '<ion-icon class="star" name="flag" id="fla"></ion-icon>',
          stateName: 'check-mark',
          onClick: function(btn,map) {
              btn.button.style.backgroundColor = 'blue';
              btn.state('x-mark');
              flag = true;
          }
      }, {
          icon: '<ion-icon class="star" name="flag" id="fla"></ion-icon>',
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

 for (var i=0; i<markers.length; i++) {

    var lon = markers[i][0];
    var lat = markers[i][1];
    var popupText = markers[i][2];

    
     var markerLocation = new L.LatLng(lat, lon);
     var marker = new L.Marker(markerLocation);
     this.map.addLayer(marker);
 
     marker.bindPopup(popupText);
 
 }

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
  async loadpuntos() {
    const loading = await this.loadingController.create({
      message: 'Refrescando puntos..'
    });
    await loading.present();

    setTimeout(() => {
      loading.dismiss();
      location.reload();
    }, 700);
   
  }


  }

  function onClick(e) {
    alert(this.getLatLng());
}
