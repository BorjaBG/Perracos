import { Component, OnInit } from '@angular/core';
import { Todo, TodoService } from '../services/todo.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';

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
    velocidad_estimada: 0,
    peso_estimado: 0,
    sustrato:'',

    createdAt: new Date().getTime(),
    
  };
 
  todoId = null;
 
  constructor(private route: ActivatedRoute, private nav: NavController, private todoService: TodoService, private loadingController: LoadingController) { }
 
  ngOnInit() {
    this.todo.latitude = this.todoService.getlatitudes();
    this.todo.longitude = this.todoService.getlongitudes();
    this.todoId = this.route.snapshot.params['id'];
    //alert(this.todoService.getlatitudes());
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

    
  

  
 
}
