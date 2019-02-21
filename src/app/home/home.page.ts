import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Todo, TodoService } from '../services/todo.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';

import leaflet from 'leaflet';

declare var ol: any;
declare var map: any;
import 'leaflet-routing-machine';
import 'leaflet-easybutton';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage  implements OnInit{
  @ViewChild('map') mapContainer: ElementRef;
  map: any;

  todo: Todo = {
    latitude: 0.0,
    longitude: 0.0,
    obserbaciones: ' ',
    direccion: ' ',
    especie: '',
    tamano: 0,
    velocidad_estimada: 0,
    peso_estimado: 0,
    sustrato:'',

    createdAt: new Date().getTime(),
    
  };
 
  todoId = null;
  constructor(private route: ActivatedRoute, private nav: NavController, private todoService: TodoService, private loadingController: LoadingController) { }
 
  ngOnInit() {
    this.todoId = this.route.snapshot.params['id'];
    if (this.todoId)  {
      this.loadTodo();
    }
  }

  async loadTodo() {
    const loading = await this.loadingController.create({
      message: 'Loading Todo..'
    });
    await loading.present();
 
    this.todoService.getTodo(this.todoId).subscribe(res => {
      loading.dismiss();
      this.todo = res;
    });
}

async saveTodo() {
 
  const loading = await this.loadingController.create({
    message: 'Saving Todo..'
  });
  await loading.present();

  if (this.todoId) {
    this.nav
    this.todoService.updateTodo(this.todo, this.todoId).then(() => {
      loading.dismiss();
    this.nav.pop();//vuelbe a la pagina anterior
    });
  } else {
    this.todoService.addTodo(this.todo).then(() => {
      loading.dismiss();
      this.nav.pop();//vuelbe a la pagina anterior
    });
  }
}

  ionViewDidEnter() {
    this.loadmap();
  }
 
  loadmap() {
    let flag : boolean = true;
    this.map = new leaflet.map("map").fitWorld( );

     //this.map.marker([43.27683038906162, -2.898330688476563], { title: "My marker" }).addTo(map);
 
    /* var marker = leaflet.marker([43.27683038906162,-2.898330688476563])
     .bindPopup("My marker")
     .addTo(this.map);*/



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
              map.on("click", function(e){
                if (flag == true) {

                // create popup contents
                var customPopup = "Mozilla Toronto Offices<br/><img src='http://joshuafrazier.info/images/maptime.gif' alt='maptime logo gif' width='350px'/>";
                    
                // specify popup options 
                var customOptions =
                    {
                    'maxWidth': '500',
                    'className' : 'custom'
                    }



                  new leaflet.Marker([e.latlng.lat, e.latlng.lng]).addTo(map);
                  
              
                }
             });
         
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


 

    leaflet.easyButton( '<ion-icon class="star" name="locate"></ion-icon>', function(control, map){

     map.locate({
      setView: true,
      maxZoom: 50
    }).on('locationfound', (e) => {
      let markerGroup = leaflet.featureGroup();
      let marker: any = leaflet.marker([e.latitude, e.longitude]).on('click', () => {
        map.setView([e.latitude,e.longitude], 13);
      
      })
      }).on('locationerror', (err) => {
        alert(err.message);
    })
    }).addTo(this.map);


    this.map.locate({
      setView: true,
      maxZoom: 50
    }).on('locationfound', (e) => {
      let markerGroup = leaflet.featureGroup();
      //alert(e.latitude+' '+ e.longitude);
      let marker: any = leaflet.marker([e.latitude, e.longitude]).on('click', () => {

      })
      markerGroup.addLayer(marker);
      marker.bindPopup("<b>Posicion actual</b>").openPopup();
      this.map.addLayer(markerGroup);
      }).on('locationerror', (err) => {
        alert(err.message);
    })
  }
}