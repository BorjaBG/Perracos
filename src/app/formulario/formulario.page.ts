import { Component, OnInit } from '@angular/core';
import { Todo, TodoService } from '../services/todo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { exists } from 'fs';

var longitudes: number;
var latitudes: number;

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.page.html',
  styleUrls: ['./formulario.page.scss'],
})

export class FormularioPage implements OnInit {

  todo: Todo = {
    latitude: 0.0,
    longitude: 0.0,
    obserbaciones: ' ',
    direccion: ' ',
    especie: '',
    tamano: 0,
    velocidad_estimada:0,
    peso_estimado: 0,
    sustrato:'',

    createdAt: new Date().getTime(),
    
  };
  todos: Todo[];
  todoId = null;
 
  constructor(private router:Router, private route: ActivatedRoute, private nav: NavController, private todoService: TodoService, private loadingController: LoadingController) { }
 
  ngOnInit() {

      longitudes = parseFloat(localStorage.getItem("1"));
      latitudes  = parseFloat(localStorage.getItem("2"));
      localStorage.clear();
      if(true == isNaN(longitudes)  || true == isNaN(latitudes) ){
        this.todo.latitude = this.todoService.getlatitudes();
        this.todo.longitude = this.todoService.getlongitudes();
      }else{
        this.loadTodo();
      }
    /*this.todoId = this.route.snapshot.params['id'];
    if (this.todoId)  {
      this.loadTodo();
    }*/
  }
 
  async loadTodo() {
    const loading = await this.loadingController.create({
      message: 'Cargando..'
    });
    await loading.present();
 
    /*this.todoService.getTodo(this.todoId).subscribe(res => {
      loading.dismiss();
      this.todo = res;
    });*/
    this.todoService.getTodos().subscribe(res => {
      
      this.todos = res;

     for (var i=0; i<res.length; i++) {
     
       if (res[i].latitude == latitudes  && res[i].longitude == longitudes){
        this.todo.latitude = res[i].latitude;
        this.todo.longitude = res[i].longitude;
        this.todo.obserbaciones = res[i].obserbaciones;
        this.todo.direccion = res[i].direccion;
        this.todo.especie = res[i].especie;
        this.todo.tamano = res[i].tamano;
        this.todo.velocidad_estimada = res[i].velocidad_estimada;
        this.todo.peso_estimado = res[i].peso_estimado;
        this.todo.sustrato = res[i].sustrato;
        this.todo.createdAt =  res[i].createdAt;
        loading.dismiss();
       }
      }
    });
  }
 
  async saveTodo() {
 
    const loading = await this.loadingController.create({
      message: 'Guardando..'
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
        this.router.navigateByUrl('/home');
        //this.nav.pop();//vuelbe a la pagina anterior
      });
    }
  }
}

