import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ComentarioService } from '../../../services/comentario/comentario.service';
import { NotificationService } from '../../../shared/notification';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comentario } from '../../../models/comentario';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss' ,
  '../../../../assets/icon/icofont/css/icofont.scss']
})
export class ComentariosComponent implements OnInit, OnChanges {
  @Input() ensayo_id: any;
  @Input() tipo: any;
  form: FormGroup;
  comentarios: any;
  comentario: Comentario;
  user: any;
  apiurl: any;
  constructor(
    private comentarioSerice: ComentarioService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
  ) {
    this.apiurl = environment.apiUrl;
    
  }

  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.comentario = new Comentario();
    this.form = this.formBuilder.group({
      comentario: [null, Validators.required],
    });
    console.log(this.ensayo_id);
    this.CargarComentarios();

  }

  CargarComentarios() {
    this.comentarioSerice.getByEnsayo(1, this.ensayo_id, this.tipo).subscribe((value) => {
      console.log(value)
      this.comentarios = value.ensayos;
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  ngOnChanges() {
    // this will be called each time userInput changes
    this.CargarComentarios();
    this.comentario = new Comentario();
  }
  guardarComentario() {
    if (!this.form.valid) {
      return false;
    }
    this.comentario.tercero = this.user.tercero;
    this.comentario.ensayo = this.ensayo_id;
    this.comentario.usuario = this.user.id;
    this.comentario.tipo = this.tipo;
     this.comentarioSerice.add(this.comentario).subscribe((value) => {
       this.comentario = new Comentario();
       this.CargarComentarios();
       this.notificationService.addNotify({ title: 'Alerta', msg: 'Comentario guardado con exito', type: 'success' });

     }, err => {

       this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
     });
  }

}
