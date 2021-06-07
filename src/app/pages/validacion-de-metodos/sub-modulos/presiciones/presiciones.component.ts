import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { PrecisionService } from '../../../../services/validacion-demetodos/precision.service';
import { NotificationService } from '../../../../shared/notification';
declare var require: any;
import { anova } from 'anova';
var anova = require('anova');
@Component({
  selector: 'app-presiciones',
  templateUrl: './presiciones.component.html',
  styleUrls: ['./presiciones.component.scss',
    '../../../../../assets/icon/icofont/css/icofont.scss']
})
export class PresicionesComponent implements OnInit {
  @Output() Guardado: EventEmitter<boolean> = new EventEmitter();
  @Input() id: string;
  @Input() presision: boolean;
  @Input() presicion_repetitibilidad: boolean;
  @Input() presicion_producivilidad: boolean;
  @Input() banco_muestras: boolean;
  @Input() numeroBlancos: number;
  @Input() Ebajo: boolean;
  @Input() Emedio: boolean;
  @Input() EAlto: boolean;
  @Input() numeroMuestras: number;
  @Input() muestra1Ab: boolean;
  @Input() muestra1Aa: boolean;
  @Input() muestra2Ab: boolean;
  @Input() muestra2Aa: boolean;
  @Input() muestra3Ab: boolean;
  @Input() muestra3Aa: boolean;
  @Input() permisosLocal: any;
  formaPrecision: FormGroup; PresicionSr = 0; PresicionSi = 0; PresicionSI = 0; Presicionrsr = 0; PresicionrsI = 0; calcularMatriz = [];
  tablaAnova = {}; btnPresision = false;
  ArrPresision = {
    analistas: 0,
    replicas: 0,
    _id: '',
    matrices: [],
    id_validacionMetodo: ''
  };
  edit: boolean;
  constructor(
    private presisiondService: PrecisionService,
    private fb: FormBuilder,
    private notificationService: NotificationService) {
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
    this.formaPrecision = new FormGroup({
      matriz: new FormControl('', Validators.required),
      arrsPresicion: this.fb.array([])
    });
    this.cargarPresiciones();
  }

  llenadoDeArrayCalculos(forma, tipoCalculo: string) {
    this.calculoLOD_LOQ(this.calcularMatriz, 'Precision');
  }
  usaMatrisBlancos(elemento, variable) {
    switch (variable) {
      case 'presision':
        if (elemento) {
          this.presision = false;
        } else {
          this.presision = true;
        }
        break;
    }
  }
  removeDato(index: number, array: string) {
    this.eliminarPosicon(index, array);
  }
  llenadoArreglo(arreglo, valores) {
    switch (arreglo) {
      case 'arrPresicion':
        valores.forEach(element => {
          const control = <FormArray>this.formaPrecision.controls['arrsPresicion'];
          control.push(this.fb.group({ arrPresicion: [`${element}`] }));
        });
        break;
    }
  }
  clickBoton(id: string) {
    document.getElementById(id).click();
  }
  calculoLOD_LOQ(matriz, calculo) {
    const precision = Array();
    if (!this.presision) {
      this.calcularMatriz = [];
      this.formaPrecision.value.arrsPresicion.forEach(element => {
        this.calcularMatriz.push(parseFloat(element['arrPresicion']));
      });
    }
    let cont = 0;
    this.calcularMatriz.forEach(element => {
      if (cont <= this.calcularMatriz.length - 2) {
        if (cont === 0) {
          precision.push([this.calcularMatriz[cont], this.calcularMatriz[cont + 1]]);
          cont = cont + 1;
        } else {
          precision.push([this.calcularMatriz[cont + 1], this.calcularMatriz[cont + 1 + 1]]);
          cont = cont + 1 + 1;
        }
      }
    });
    console.log('========= tabla ==========');
    this.tablaAnova = anova.table(precision);
    console.log(precision);
    console.log(this.tablaAnova);
    this.PresicionSr = Math.sqrt(this.tablaAnova['residual']['MS']);
    this.PresicionSi = Math.sqrt(
      (Math.abs(this.tablaAnova['treatment']['MS'] - this.PresicionSr)) /
      ((this.tablaAnova['total']['DF'] + 1) / (this.tablaAnova['treatment']['DF'] + 1))
    );
    this.PresicionSI = Math.sqrt(Math.pow(this.PresicionSr, 2) + Math.pow(this.PresicionSi, 2));
    this.Presicionrsr = 2.8 * this.PresicionSr;
    this.PresicionrsI = 2.8 * this.PresicionSI;
    this.btnPresision = true;
  }
  eliminarPosicon(index: number, array: string) {
    let control;
    switch (array) {
      case 'arrPresicion':
        control = <FormArray>this.formaPrecision.controls['arrsPresicion'];
        control.removeAt(index);
        break;
    }
  }
  get arrPresicion() {
    return this.formaPrecision.get('arrsPresicion') as FormArray;
  }
  data2(event: ClipboardEvent, array: string) {
    const datosArray = [];
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    const row_data = pastedText.split('\n');
    row_data.forEach((valor, index) => {
      valor = valor.replace(',', '.');
      if (valor !== '') {
        datosArray.push(parseFloat(valor));
      }
    });
    this.llenadoArreglo(array, datosArray);
  }
  cargarPresiciones() {
    this.presisiondService.get(this.id).subscribe((resp: any) => {
      if (resp.success) {
        console.log(resp)
        this.ArrPresision = resp.precisiones[0];
        if (resp.precisiones.length !== 0) {
          this.presisiondService.getMatrices(this.ArrPresision['_id']).subscribe( (resp: any) => {
            console.log(resp)
          })
        } else {
          this.ArrPresision = {
            analistas: 0,
            replicas: 0,
            _id: '',
            matrices: [],
            id_validacionMetodo: ''
          };
        }
      } else {
        this.notificationService.addNotify({ title: 'Precisión', msg: resp.message, type: 'error' });
      }
    });
  }
  guardaPresision(): void {
    console.log(this.ArrPresision)
    if (this.ArrPresision._id === '') {
      this.ArrPresision['id_validacionMetodo'] = this.id;
      this.ArrPresision['matriz'] = this.calcularMatriz;
      this.presisiondService.create(this.ArrPresision).subscribe((resp: any) => {
        if (resp.success) {
          console.log('Crear', resp);
          this.ArrPresision = resp.precisionStored;
          this.notificationService.addNotify({ title: 'Presisión', msg: resp.message, type: 'success' });
          this.Guardado.emit(true);
        } else {
          this.notificationService.addNotify({ title: 'Presisión', msg: resp.error, type: 'error' });
          this.Guardado.emit(false);
        }
      });
    } else {
      this.ArrPresision['matriz'] = [];
      this.ArrPresision['matriz'] = this.calcularMatriz;
      this.presisiondService.edit(this.ArrPresision).subscribe((resp: any) => {
        if (resp.success) {
          console.log('Editar', resp);
          this.ArrPresision = {
            analistas: 0,
            replicas: 0,
            _id: '',
            matrices: [],
            id_validacionMetodo: ''
          };
          this.ArrPresision = resp.precision;
          this.notificationService.addNotify({ title: 'Presisión', msg: resp.message, type: 'success' });
          this.Guardado.emit(true);
        } else {
          this.notificationService.addNotify({ title: 'Presisión', msg: resp.error, type: 'error' });
          this.Guardado.emit(false);
        }
      });
    }
  }
  EliminarPresicion() {
    this.presisiondService.delete(this.ArrPresision._id).subscribe((resp: any) => {
      if (resp.success) {
        this.notificationService.addNotify({ title: 'Precisión', msg: resp.message, type: 'success' });
      } else {
        this.notificationService.addNotify({ title: 'Precisión', msg: resp.message, type: 'error' });
      }
    });
  }
}
