import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ExactitudService } from '../../../../services/validacion-demetodos/exactitud.service';
import { NotificationService } from '../../../../shared/notification';
import { mean } from 'simple-statistics';
import { Exactitud } from '../../../../models/Exactitud';

@Component({
  selector: 'app-exactitud',
  templateUrl: './exactitud.component.html',
  styleUrls: ['./exactitud.component.scss',
    '../../../../../assets/icon/icofont/css/icofont.scss']
})
export class ExactitudComponent implements OnInit {
  @Output() Guardado: EventEmitter<any> = new EventEmitter();
  @Input() id: string;
  @Input() exactitud: boolean;
  @Input() banco_muestras: boolean;
  @Input() muestra1Ab: boolean;
  @Input() muestra1Aa: boolean;
  @Input() muestra2Ab: boolean;
  @Input() muestra2Aa: boolean;
  @Input() porcentajeRaABm1: any;
  @Input() porcentajeRaAAm1: any;
  @Input() muestra3Ab: boolean;
  @Input() muestra3Aa: boolean;
  @Input() porcentajeRaABm3: any;
  @Input() porcentajeRaAAm3: any;
  @Input() porcentajeRaABm2: any;
  @Input() porcentajeRaAAm2: any;
  @Input() numeroMuestras: number;
  @Input() permisosLocal: any;
  btnExactitud: boolean = false;
  exactitudb = 0; exactitudbpor = 0; exactitudr = 0; exactitudrpor = 0; arrayCalc = []; promrecnM1 = 0;
  promrecnM1Aa = 0; promrecnM1Ab = 0; promrecnM2 = 0; promrecnM2Aa = 0; promrecnM2Ab = 0; promrecnM3 = 0; promrecnM3Aa = 0;
  promrecnM3Ab = 0; op1 = false; op2 = false; op3 = false; exactitudb2 = 0; exactitudbpor2 = 0; exactitudr2 = 0; promMetoidoref = 0;
  muestraData = false; calculaMatrix = true; errorEb = 0; errorEm = 0; errorEa = 0; muestraData2 = false; calcularMatriz = [];
  ArrLExactitud: Exactitud;
  formaExactitud: FormGroup;
  edit: boolean;
  constructor(
    private fb: FormBuilder,
    private exactitudService: ExactitudService,
    private notificationService: NotificationService) {
    this.ArrLExactitud = new Exactitud();
    this.edit = false;
  }

  ngOnInit() {
    this.formaExactitud = new FormGroup({
      exactitud1: new FormControl(false, Validators.required),
      exactitud2: new FormControl(false, Validators.required),
      exactitud3: new FormControl(false, Validators.required),
      xref: new FormControl('', Validators.required),
      matriz: new FormControl('', Validators.required),
      unidad: new FormControl(''),
      metodosRef: this.fb.array([]),
      arrsExctitud: this.fb.array([])
    });
    this.cargarExactitud();
    // console.log(this.ArrLExactitud);
  }

  selectCheck2(event) {
    if (event.target.checked) {
      this.muestraData2 = true;
    } else {
      this.muestraData2 = false;
    }
  }
  selectCheck(event) {
    if (event.target.checked) {
      this.muestraData = true;
    } else {
      this.muestraData = false;
    }
  }
  usaMatrisBlancos(elemento, variable) {
    switch (variable) {
      case 'exactitud':
        if (elemento) {
          this.exactitud = false;
        } else {
          this.exactitud = true;
        }
        break;
    }
  }
  edicion() {
    if (this.edit) {
      this.edit = false;
    } else {
      this.edit = true;
    }
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


  addinput(index, data) {
    if (data == 'metodoRef') {
      const control = <FormArray>this.formaExactitud.controls['metodosRef'];
      control.insert(index + 1, this.fb.group({ metodoRef: [``] }));
    } else {
      const control = <FormArray>this.formaExactitud.controls['arrsExctitud'];
      control.insert(index + 1, this.fb.group({ arrExctitud: [``] }));
    }

  }
  llenadoArreglo(arreglo, valores) {
    switch (arreglo) {
      case 'metodoRef':
        valores.forEach(element => {
          const control = <FormArray>this.formaExactitud.controls['metodosRef'];
          control.push(this.fb.group({ metodoRef: [`${element}`] }));
        });
        break;
      case 'arrExctitud':
        valores.forEach(element => {
          const control = <FormArray>this.formaExactitud.controls['arrsExctitud'];
          control.push(this.fb.group({ arrExctitud: [`${element}`] }));
        });
        break;

      default:
        console.log(arreglo);
        break;
    }
  }
  llenadoDeArrayCalculos(forma, tipoCalculo: string) {
    if (tipoCalculo === 'Exactitud') {
      this.calculaMatrix = false;
      if (forma.value.exactitud2) {
        this.op2 = true;
      }
      if (forma.value.exactitud1) {
        this.op1 = true;
      }
      if (forma.value.exactitud3) {
        this.op3 = true;
      }
      this.calculoLOD_LOQ(this.calcularMatriz, 'Exactitud');
    }
    if (tipoCalculo === 'Exactitud2') {
      this.calculaMatrix = true;
      this.calculoLOD_LOQ(this.calcularMatriz, 'Exactitud');
    }
  }
  calculoLOD_LOQ(matriz, calculo) {
    this.arrayCalc = [];
    if (!this.exactitud) {
      this.calcularMatriz = [];
      this.formaExactitud.value.arrsExctitud.forEach(element => {
        this.calcularMatriz.push(parseFloat(element['arrExctitud']));
      });
    }
    const datos = [];
    if (this.formaExactitud.value.exactitud1) {
      this.exactitudb = mean(this.calcularMatriz) - this.formaExactitud.value.xref;
      this.exactitudbpor = (mean(this.calcularMatriz) - this.formaExactitud.value.xref) / this.formaExactitud.value.xref;
      this.exactitudr = mean(this.calcularMatriz) / this.formaExactitud.value.xref;
    }
    if (this.numeroMuestras >= 1 && this.muestra1Ab && this.muestra1Aa) {
      this.arrayCalc.push(mean(this.porcentajeRaABm1));
      this.arrayCalc.push(mean(this.porcentajeRaAAm1));
      this.arrayCalc.push(mean([mean(this.porcentajeRaABm1), mean(this.porcentajeRaAAm1)]));
      this.promrecnM1 = mean([mean(this.porcentajeRaABm1), mean(this.porcentajeRaAAm1)]);
      this.promrecnM1Aa = mean(this.porcentajeRaAAm1);
      this.promrecnM1Ab = mean(this.porcentajeRaABm1);
    }
    if (this.numeroMuestras >= 2 && this.muestra2Ab && this.muestra2Aa) {
      this.arrayCalc.push(mean(this.porcentajeRaABm2));
      this.arrayCalc.push(mean(this.porcentajeRaAAm2));
      this.arrayCalc.push(mean([mean(this.porcentajeRaABm2), mean(this.porcentajeRaAAm2)]));
      this.promrecnM2 = mean([mean(this.porcentajeRaABm2), mean(this.porcentajeRaAAm2)]);
      this.promrecnM2Aa = mean(this.porcentajeRaAAm2);
      this.promrecnM2Ab = mean(this.porcentajeRaABm2);
    }
    if (this.numeroMuestras >= 3 && this.muestra3Ab && this.muestra3Aa) {
      this.arrayCalc.push(mean(this.porcentajeRaABm3));
      this.arrayCalc.push(mean(this.porcentajeRaAAm3));
      this.arrayCalc.push(mean([mean(this.porcentajeRaABm3), mean(this.porcentajeRaAAm3)]));
      this.promrecnM3 = mean([mean(this.porcentajeRaABm3), mean(this.porcentajeRaAAm3)]);
      this.promrecnM3Aa = mean(this.porcentajeRaAAm3);
      this.promrecnM3Ab = mean(this.porcentajeRaABm3);
    }
    if (this.arrayCalc.length > 0) {
      this.exactitudrpor = mean(this.arrayCalc);
    }
    if (this.formaExactitud.value.exactitud3) {
      this.formaExactitud.value.metodosRef.forEach(element => {
        datos.push(parseFloat(element['metodoRef']));
      });
      this.promMetoidoref = mean(datos);
      this.exactitudb2 = mean(this.calcularMatriz) - this.promMetoidoref;
      this.exactitudbpor2 = (mean(this.calcularMatriz) - this.promMetoidoref) / this.promMetoidoref;
      this.exactitudr2 = mean(this.calcularMatriz) / this.promMetoidoref;
    }
    this.btnExactitud = true;
    const array = {...this.ArrLExactitud};
    array['exactitudb'] = this.exactitudb;
    array['exactitudbpor'] = this.exactitudbpor;
    array['exactitudr'] = this.exactitudr;
    array['exactitudrpor'] = this.exactitudrpor;
    array['errorEb'] = this.errorEb;
    array['errorEm'] = this.errorEm;
    array['errorEa'] = this.errorEa;
    array['promrecnM1'] = this.promrecnM1;
    array['promrecnM1Aa'] = this.promrecnM1Aa;
    array['promrecnM1Ab'] = this.promrecnM1Ab;
    array['promrecnM2'] = this.promrecnM2;
    array['promrecnM2Aa'] = this.promrecnM2Aa;
    array['promrecnM2Ab'] = this.promrecnM2Ab;
    array['promrecnM3'] = this.promrecnM3;
    array['promrecnM3Aa'] = this.promrecnM3Aa;
    array['promrecnM3Ab'] = this.promrecnM3Ab;
    array['exactitudb2'] = this.exactitudb2;
    array['exactitudbpor2'] = this.exactitudbpor2;
    array['exactitudr2'] = this.exactitudr2;
    const Exactitud = {
      guardado: false,
      exactitud: true,
      arr: array
    }
    this.Guardado.emit(Exactitud)
  }
  removeDato(index: number, array: string) {
    this.eliminarPosicon(index, array);
  }
  clickBoton(id: string) {
    document.getElementById(id).click();
  }
  eliminarPosicon(index: number, array: string) {
    let control;
    switch (array) {
      case 'arrExctitud':
        control = <FormArray>this.formaExactitud.controls['arrsExctitud'];
        control.removeAt(index);
        break;
      case 'metodoRef':
        control = <FormArray>this.formaExactitud.controls['metodosRef'];
        control.removeAt(index);
        break;
    }
  }
  get MetodoRef() {
    return this.formaExactitud.get('metodosRef') as FormArray;
  }
  get arrExctitud() {
    return this.formaExactitud.get('arrsExctitud') as FormArray;
  }
  // Funciones Dase de datos
  cargarExactitud() {
    this.exactitudService.get(this.id).subscribe((resp: any) => {
      if (resp.success) {
        this.ArrLExactitud = resp.Exactitudes[0];
        console.log(this.ArrLExactitud)
        if (resp.Exactitudes.length > 0) {
          this.formaExactitud.setValue({
            exactitud1: this.ArrLExactitud['medirMR'],
            exactitud2: this.ArrLExactitud['medirBlancos'],
            exactitud3: this.ArrLExactitud['medirMRMetodoCacicato'],
            xref: this.ArrLExactitud['Xref'],
            unidad: this.ArrLExactitud['unidad'],
            matriz: '',
            metodosRef: [],
            arrsExctitud: [],
          });
          this.muestraData2 = this.ArrLExactitud['medirMR'];
          this.muestraData = this.ArrLExactitud['medirMRMetodoCacicato'];
          if (this.ArrLExactitud['metodosRef'].length > 0) {
            this.muestraData = true;
            this.llenadoArreglo('metodoRef', this.ArrLExactitud['metodosRef']);
          }
          this.llenadoArreglo('arrExctitud', this.ArrLExactitud['Matriz']);
          this.exactitud = false;
          this.clickBoton('btn-Exactutud');
        } else {
          this.ArrLExactitud = new Exactitud();
        }
      }
    });
  }
  EliminarExactitud() {
    this.exactitudService.delete(this.ArrLExactitud._id).subscribe((resp: any) => {
      if (resp.success) {
        this.notificationService.addNotify({ title: 'Exactitud', msg: resp.message, type: 'success' });
      } else {
        this.notificationService.addNotify({ title: 'Exactitud', msg: resp.message, type: 'error' });
      }
    });
  }
  guardarExactitud(): void {
    this.ArrLExactitud['medirMR'] = this.formaExactitud.value.exactitud1;
    this.ArrLExactitud['medirBlancos'] = this.formaExactitud.value.exactitud2;
    this.ArrLExactitud['unidad'] = this.formaExactitud.value.unidad;
    this.ArrLExactitud['medirMRMetodoCacicato'] = this.formaExactitud.value.exactitud3;
    this.ArrLExactitud['Xref'] = this.formaExactitud.value.xref;
    this.ArrLExactitud['id_validacionMetodo'] = this.id;
    this.ArrLExactitud['Matriz'] = this.calcularMatriz;
    this.formaExactitud.value.metodosRef.forEach(element => {
    this.ArrLExactitud['metodosRef'].push(parseFloat(element['metodoRef']))
    const array = {...this.ArrLExactitud};
    array['exactitudb'] = this.exactitudb;
    array['exactitudbpor'] = this.exactitudbpor;
    array['exactitudr'] = this.exactitudr;
    array['exactitudrpor'] = this.exactitudrpor;
    array['exactitudb2'] = this.exactitudb2;  
    array['exactitudbpor2'] = this.exactitudbpor2
    array['exactitudr2'] = this.exactitudr2;
    });
    console.log(this.ArrLExactitud);
    if (this.ArrLExactitud._id === '' || this.ArrLExactitud._id === undefined) {
      this.exactitudService.create(this.ArrLExactitud).subscribe((resp: any) => {
        console.log('creado', resp)
        if (resp.success) {
          this.ArrLExactitud = resp.ExactitudStored[0];
          const Exactitud = {
            guardado: true,
            exactitud: true,
            arr: this.ArrLExactitud
          }
          this.Guardado.emit(Exactitud)
          this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'success' });
        } else {
          const Exactitud = {
            guardado: false,
            exactitud: false,
            arr: []
          }
          this.Guardado.emit(Exactitud)
          this.notificationService.addNotify({ title: 'Alerta', msg: resp.error, type: 'error' });
        }
      });
    } else {
      this.llenadoDeArrayCalculos(this.formaExactitud, 'Exactitud');
      this.exactitudService.edit(this.ArrLExactitud).subscribe((resp: any) => {
        if (resp.success) {
          console.log('editar', resp)
          this.ArrLExactitud = new Exactitud();
          this.ArrLExactitud = resp.ExactitudStored;
          this.notificationService.addNotify({ title: 'Exactitud', msg: resp.message, type: 'success' });
          console.log(resp)
          const ExactitudData = {
            guardado: true,
            exactitud: true,
            arr: this.ArrLExactitud
          }
          this.Guardado.emit(ExactitudData)
        } else {
          const ExactitudData = {
            guardado: false,
            exactitud: false,
            arr: []
          }
          this.Guardado.emit(ExactitudData)
          this.notificationService.addNotify({ title: 'Exactitud', msg: resp.error, type: 'error' });
        }
      });
    }
  }

}
