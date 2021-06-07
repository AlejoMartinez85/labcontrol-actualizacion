import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CambiarperfilService {

  private message = new BehaviorSubject('First Message');
  sharedMessage = this.message.asObservable();

  constructor() { }

  nextMessage(user: any) {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    userInfo.imagen = user.imagen;
    userInfo.name = user.name;
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    this.message.next(user);
  }

}
