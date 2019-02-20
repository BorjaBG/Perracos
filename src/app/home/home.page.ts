import { Component, ViewChild, ElementRef } from '@angular/core';

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
export class HomePage {
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  ionViewDidEnter() {
    this.loadmap();
  }
 
  loadmap() {
  
    this.map = leaflet.map("map").fitWorld( );
    leaflet.control.scale().addTo(this.map);

    leaflet.tileLayer('https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=8a579859eda74a3bab08b97aa36c56ad', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(this.map);

    leaflet.easyButton( '<span class="star">&starf;</span>', function(){
      alert('you just clicked the html entity \&starf;');
    }).addTo(this.map);


    this.map.locate({
      setView: true,
      maxZoom: 50
    }).on('locationfound', (e) => {
      let markerGroup = leaflet.featureGroup();
      let marker: any = leaflet.marker([e.latitude, e.longitude]).on('click', () => {
       alert('Marker clicked');
        //map.flyTo({center: [e.latitude, e.longitude]});
       // map.easeTo({center: [e.latitude, e.longitude]});
      })
      markerGroup.addLayer(marker);
      this.map.addLayer(markerGroup);
      }).on('locationerror', (err) => {
        alert(err.message);
    })

 

  }
  
}

