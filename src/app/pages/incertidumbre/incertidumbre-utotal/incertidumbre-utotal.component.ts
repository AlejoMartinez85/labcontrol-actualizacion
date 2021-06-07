import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { ParametroCalibacionService } from '../../../services/parametro-calibacion/parametro-calibacion.service';
import { ParametroService } from '../../../services/parametro/parametro.service';
import { NotificationService } from '../../../shared/notification';

@Component({
  selector: 'app-incertidumbre-utotal',
  templateUrl: './incertidumbre-utotal.component.html',
  styleUrls: ['./incertidumbre-utotal.component.scss']
})
export class IncertidumbreUtotalComponent implements OnInit, OnChanges {

  @Input() parametro: any;
  parametroresult: any;
  constructor(
    public parametroCalibacionService: ParametroCalibacionService,
    private notificationService: NotificationService
  ) { }
  getParametroByID() {
    this.parametroCalibacionService.add(this.parametro).subscribe((value) => {
      this.parametroresult = value.data;
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Parametro almacenado con exito', type: 'success' });
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  ngOnInit() {
    this.getParametroByID();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.parametro != undefined) {
      this.parametro = changes.parametro.currentValue;
      this.getParametroByID();
    }
  }
  actualizardatos(){
    this.getParametroByID();
  }

}
