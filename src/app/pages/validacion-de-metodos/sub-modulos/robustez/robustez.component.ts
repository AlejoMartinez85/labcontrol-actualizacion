import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RobustezService } from '../../../../services/validacion-demetodos/robustez.service';
import { NotificationService } from '../../../../shared/notification';
import { mean, sampleStandardDeviation} from 'simple-statistics';
import { Robustez } from '../../../../models/robustez';
import { element } from 'protractor';
@Component({
  selector: 'app-robustez',
  templateUrl: './robustez.component.html',
  styleUrls: ['./robustez.component.scss',
  '../../../../../assets/icon/icofont/css/icofont.scss']
})
export class RobustezComponent implements OnInit {
  @Output() Guardado: EventEmitter<any> = new EventEmitter();
  @Input() id: string;
  @Input() permisosLocal: any;
  edit: boolean;
  formaRobustez: FormGroup;
   /**
   * Robustez
   */
  RoV1f1 = ''; RoV2f1 = ''; RoV1f2 = ''; RoV2f2 = ''; RoV1f3 = ''; RoV2f3 = ''; RoV1f4 = ''; RoV2f4 = ''; RoV1f5 = ''; RoV2f5 = '';
  RoV1f6 = ''; RoV2f6 = ''; RoV1f7 = ''; RoV2f7 = ''; exp1 = 0; exp2 = 0; exp3 = 0; exp4 = 0; exp5 = 0; exp6 = 0; exp7 = 0; exp8 = 0;
  arrayRobustez = []; arrayRobustezAltos = []; arrayRobustezBajos = []; X_x = []; RobustezCritica = 0; significant = [];
  ArrRobustez : Robustez;
  constructor(
    private robustezService: RobustezService,
    private notificationService: NotificationService
    ) {
      this.ArrRobustez = new Robustez();
      this.edit = false;
    }
  edicion() {
    if (this.edit) {
      this.edit = false;
    } else {
      this.edit = true;
    }
  }
  ngOnInit() {
    this.formaRobustez = new FormGroup({
      unidad: new FormControl(''),
      valor1Nombre: new FormControl('Variable 1'),
      valor1Va: new FormControl('20'),
      valor1Vb: new FormControl('10'),
      valor2Nombre: new FormControl('Variable 2'),
      valor2Va: new FormControl('20'),
      valor2Vb: new FormControl('10'),
      valor3Nombre: new FormControl('Variable 3'),
      valor3Va: new FormControl('20'),
      valor3Vb: new FormControl('10'),
      valor4Nombre: new FormControl('Variable 4'),
      valor4Va: new FormControl('20'),
      valor4Vb: new FormControl('10'),
      valor5Nombre: new FormControl('Variable 5'),
      valor5Va: new FormControl('20'),
      valor5Vb: new FormControl('10'),
      valor6Nombre: new FormControl('Variable 6'),
      valor6Va: new FormControl('20'),
      valor6Vb: new FormControl('10'),
      valor7Nombre: new FormControl('Variable 7'),
      valor7Va: new FormControl('20'),
      valor7Vb: new FormControl('10'),
      dato1: new FormControl(''),
      dato2: new FormControl(''),
      dato3: new FormControl(''),
      dato4: new FormControl(''),
      dato5: new FormControl(''),
      dato6: new FormControl(''),
      dato7: new FormControl(''),
      dato8: new FormControl(''),
    });
    this.cargarRobustez();
  }
  calculaRobustez() {
    this.X_x = [];
    this.arrayRobustez = [];
    this.arrayRobustezAltos = [];
    this.arrayRobustezBajos = [];

    this.arrayRobustez[0] = this.formaRobustez.value.dato1;
    this.arrayRobustez[1] = this.formaRobustez.value.dato2;
    this.arrayRobustez[2] = this.formaRobustez.value.dato3;
    this.arrayRobustez[3] = this.formaRobustez.value.dato4;
    this.arrayRobustez[4] = this.formaRobustez.value.dato5;
    this.arrayRobustez[5] = this.formaRobustez.value.dato6;
    this.arrayRobustez[6] = this.formaRobustez.value.dato7;
    this.arrayRobustez[7] = this.formaRobustez.value.dato8;

    this.arrayRobustezAltos[0] = mean([this.arrayRobustez[0], this.arrayRobustez[1], this.arrayRobustez[2], this.arrayRobustez[3]]);
    this.arrayRobustezAltos[1] = mean([this.arrayRobustez[0], this.arrayRobustez[1], this.arrayRobustez[2], this.arrayRobustez[4]]);
    this.arrayRobustezAltos[2] = mean([this.arrayRobustez[0], this.arrayRobustez[2], this.arrayRobustez[4], this.arrayRobustez[6]]);
    this.arrayRobustezAltos[3] = mean([this.arrayRobustez[0], this.arrayRobustez[1], this.arrayRobustez[6], this.arrayRobustez[7]]);
    this.arrayRobustezAltos[4] = mean([this.arrayRobustez[0], this.arrayRobustez[2], this.arrayRobustez[5], this.arrayRobustez[7]]);
    this.arrayRobustezAltos[5] = mean([this.arrayRobustez[0], this.arrayRobustez[3], this.arrayRobustez[4], this.arrayRobustez[7]]);
    this.arrayRobustezAltos[6] = mean([this.arrayRobustez[0], this.arrayRobustez[3], this.arrayRobustez[5], this.arrayRobustez[6]]);

    this.arrayRobustezBajos[0] = mean([this.arrayRobustez[4], this.arrayRobustez[5], this.arrayRobustez[6], this.arrayRobustez[7]]);
    this.arrayRobustezBajos[1] = mean([this.arrayRobustez[3], this.arrayRobustez[5], this.arrayRobustez[6], this.arrayRobustez[7]]);
    this.arrayRobustezBajos[2] = mean([this.arrayRobustez[1], this.arrayRobustez[3], this.arrayRobustez[5], this.arrayRobustez[7]]);
    this.arrayRobustezBajos[3] = mean([this.arrayRobustez[2], this.arrayRobustez[3], this.arrayRobustez[4], this.arrayRobustez[5]]);
    this.arrayRobustezBajos[4] = mean([this.arrayRobustez[1], this.arrayRobustez[3], this.arrayRobustez[4], this.arrayRobustez[6]]);
    this.arrayRobustezBajos[5] = mean([this.arrayRobustez[1], this.arrayRobustez[2], this.arrayRobustez[5], this.arrayRobustez[6]]);
    this.arrayRobustezBajos[6] = mean([this.arrayRobustez[1], this.arrayRobustez[2], this.arrayRobustez[4], this.arrayRobustez[7]]);

    this.arrayRobustezAltos.forEach((element, index) => {
      this.X_x.push(Math.abs(this.arrayRobustezAltos[index] - this.arrayRobustezBajos[index]));
    });
    this.RobustezCritica = sampleStandardDeviation(this.arrayRobustez)*Math.sqrt(2) ;
    this.X_x.forEach(element=>{
      if (element > this.RobustezCritica){
        this.significant.push('Sensible');
      }else if(element <= this.RobustezCritica){
        this.significant.push('No Sensible');
      }
    })
    
    console.log('Altos', this.arrayRobustezAltos);
    console.log('Bajos', this.arrayRobustezBajos);
    console.log('X-x', this.X_x);
    console.log('Desviación Estandar Robustez', this.RobustezCritica);
    this.ArrRobustez['ValorDeCalibracion'] = []
    this.ArrRobustez['valor1'] = this.formaRobustez.value.dato1;
    this.ArrRobustez['valor2'] = this.formaRobustez.value.dato2;
    this.ArrRobustez['valor3'] = this.formaRobustez.value.dato3;
    this.ArrRobustez['valor4'] = this.formaRobustez.value.dato4;
    this.ArrRobustez['valor5'] = this.formaRobustez.value.dato5;
    this.ArrRobustez['valor6'] = this.formaRobustez.value.dato6;
    this.ArrRobustez['valor7'] = this.formaRobustez.value.dato7;
    this.ArrRobustez['valor8'] = this.formaRobustez.value.dato8;
    this.ArrRobustez['ValorDeCalibracion']
      .push({
        nombre: this.formaRobustez.value.valor1Nombre,
        valorAlto: this.formaRobustez.value.valor1Va,
        valorBajo: this.formaRobustez.value.valor1Vb,
        X_x: this.X_x[0],
        significant: this.significant[0]
      });
    this.ArrRobustez['ValorDeCalibracion']
      .push({
        nombre: this.formaRobustez.value.valor2Nombre,
        valorAlto: this.formaRobustez.value.valor2Va,
        valorBajo: this.formaRobustez.value.valor2Vb,
        X_x: this.X_x[1],
        significant: this.significant[1]
      });
    this.ArrRobustez['ValorDeCalibracion']
      .push({
        nombre: this.formaRobustez.value.valor3Nombre,
        valorAlto: this.formaRobustez.value.valor3Va,
        valorBajo: this.formaRobustez.value.valor3Vb,
        X_x: this.X_x[2],
        significant: this.significant[2]
      });
    this.ArrRobustez['ValorDeCalibracion']
      .push({
        nombre: this.formaRobustez.value.valor4Nombre,
        valorAlto: this.formaRobustez.value.valor4Va,
        valorBajo: this.formaRobustez.value.valor4Vb,
        X_x: this.X_x[3],
        significant: this.significant[3]
      });
    this.ArrRobustez['ValorDeCalibracion']
      .push({
        nombre: this.formaRobustez.value.valor5Nombre,
        valorAlto: this.formaRobustez.value.valor5Va,
        valorBajo: this.formaRobustez.value.valor5Vb,
        X_x: this.X_x[4],
        significant: this.significant[4]
      });
    this.ArrRobustez['ValorDeCalibracion']
      .push({
        nombre: this.formaRobustez.value.valor6Nombre,
        valorAlto: this.formaRobustez.value.valor6Va,
        valorBajo: this.formaRobustez.value.valor6Vb,
        X_x: this.X_x[5],
        significant: this.significant[5]
      });
    this.ArrRobustez['ValorDeCalibracion']
      .push({
        nombre: this.formaRobustez.value.valor7Nombre,
        valorAlto: this.formaRobustez.value.valor7Va,
        valorBajo: this.formaRobustez.value.valor7Vb,
        X_x: this.X_x[6],
        significant: this.significant[6]
      });
    this.ArrRobustez['id_validacionMetodo'] = this.id;
    this.ArrRobustez['unidad'] = this.formaRobustez.value.unidad;
    this.ArrRobustez['X_x'] = this.X_x;
    this.ArrRobustez['robustezCritica'] = this.RobustezCritica;
    this.ArrRobustez['robustezCriticaType'] = typeof this.RobustezCritica;
    this.notificationService.addNotify({ title: 'Robustez', msg: 'Análisis Realizado', type: 'success' });
    const array = {...this.ArrRobustez}
    const RobustezData = {
      gurdado: false,
      robstez: true,
      arr: array
    }
    this.Guardado.emit(RobustezData)
    
  }
  clickBoton(id: string) {
    document.getElementById(id).click();
  }
  cargarRobustez() {
    this.robustezService.get(this.id).subscribe((resp: any) => {
      console.log(resp);
      if (resp.success) {
        if (resp.robustez.length > 0) {
          this.ArrRobustez = resp.robustez[0];
          this.formaRobustez.setValue({
            valor1Nombre: this.ArrRobustez['ValorDeCalibracion'][0]['nombre'],
            valor1Va: this.ArrRobustez['ValorDeCalibracion'][0]['valorAlto'],
            valor1Vb: this.ArrRobustez['ValorDeCalibracion'][0]['valorBajo'],
            valor2Nombre: this.ArrRobustez['ValorDeCalibracion'][1]['nombre'],
            valor2Va: this.ArrRobustez['ValorDeCalibracion'][1]['valorAlto'],
            valor2Vb: this.ArrRobustez['ValorDeCalibracion'][1]['valorBajo'],
            valor3Nombre: this.ArrRobustez['ValorDeCalibracion'][2]['nombre'],
            valor3Va: this.ArrRobustez['ValorDeCalibracion'][2]['valorAlto'],
            valor3Vb: this.ArrRobustez['ValorDeCalibracion'][2]['valorBajo'],
            valor4Nombre: this.ArrRobustez['ValorDeCalibracion'][3]['nombre'],
            valor4Va: this.ArrRobustez['ValorDeCalibracion'][3]['valorAlto'],
            valor4Vb: this.ArrRobustez['ValorDeCalibracion'][3]['valorBajo'],
            valor5Nombre: this.ArrRobustez['ValorDeCalibracion'][4]['nombre'],
            valor5Va: this.ArrRobustez['ValorDeCalibracion'][4]['valorAlto'],
            valor5Vb: this.ArrRobustez['ValorDeCalibracion'][4]['valorBajo'],
            valor6Nombre: this.ArrRobustez['ValorDeCalibracion'][5]['nombre'],
            valor6Va: this.ArrRobustez['ValorDeCalibracion'][5]['valorAlto'],
            valor6Vb: this.ArrRobustez['ValorDeCalibracion'][5]['valorBajo'],
            valor7Nombre: this.ArrRobustez['ValorDeCalibracion'][6]['nombre'],
            valor7Va: this.ArrRobustez['ValorDeCalibracion'][6]['valorAlto'],
            valor7Vb: this.ArrRobustez['ValorDeCalibracion'][6]['valorBajo'],
            unidad: this.ArrRobustez['unidad'],
            dato1: this.ArrRobustez['valor1'],
            dato2: this.ArrRobustez['valor2'],
            dato3: this.ArrRobustez['valor3'],
            dato4: this.ArrRobustez['valor4'],
            dato5: this.ArrRobustez['valor5'],
            dato6: this.ArrRobustez['valor6'],
            dato7: this.ArrRobustez['valor7'],
            dato8: this.ArrRobustez['valor8'],
          });
          this.calculaRobustez();
          
        } else {
          this.ArrRobustez = new Robustez();
        }
      } else {
        this.notificationService.addNotify({ title: 'Robutez', msg: resp.error, type: 'error' });
      }
    });
  }
  guardarRobustez(): void {
    console.log(this.ArrRobustez)
    if (this.ArrRobustez._id !== undefined) {
      this.robustezService.update(this.ArrRobustez).subscribe((resp: any) => {
        if (resp.success) {
          this.ArrRobustez = new Robustez();
          this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'success' });
          this.ArrRobustez = resp.robustez;
          const RobustezData = {
            gurdado: true,
            robstez: true,
            arr: this.ArrRobustez
          }
          this.Guardado.emit(RobustezData)
        } else {
          const RobustezData = {
            gurdado: false,
            robstez: false,
            arr: []
          }
          this.Guardado.emit(RobustezData)
          this.notificationService.addNotify({ title: 'Alerta', msg: resp.error, type: 'error' });
        }
      });
    } else {
      this.robustezService.create(this.ArrRobustez).subscribe((resp: any) => {
        if (resp.success) {
          this.ArrRobustez = new Robustez();
          this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'success' });
          this.ArrRobustez = resp.robustezStored;
          const RobustezData = {
            gurdado: true,
            robstez: true,
            arr: this.ArrRobustez
          }
          this.Guardado.emit(RobustezData)
        } else {
          this.notificationService.addNotify({ title: 'Alerta', msg: resp.error, type: 'error' });
          const RobustezData = {
            gurdado: false,
            robstez: false,
            arr: []
          }
          this.Guardado.emit(RobustezData)
        }
      });
    }
  }

}
