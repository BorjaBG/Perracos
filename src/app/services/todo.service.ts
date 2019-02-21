import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActionSequence } from 'protractor';

export interface Todo{

  latitude: number,
  longitude: number,
  createdAt: number;
  direccion: string;
    especie: string;
    tamano: number;
    velocidad_estimada: number;
    peso_estimado: number;
    sustrato:string;
    obserbaciones: string;

}

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todosCollection: AngularFirestoreCollection<Todo>;

  private todos: Observable<Todo[]>;
  constructor(db: AngularFirestore) { 
    this.todosCollection = db.collection<Todo>('todos');

    this.todos = this.todosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );
  }

  getTodos() {
    return this.todos;
  }
 
  getTodo(id) {
    return this.todosCollection.doc<Todo>(id).valueChanges();
  }
 
  updateTodo(todo: Todo, id: string) {
    return this.todosCollection.doc(id).update(todo);
  }
 
  addTodo(todo: Todo) {
    return this.todosCollection.add(todo);
  }
 
  removeTodo(id) {
    return this.todosCollection.doc(id).delete();
  }




}
