import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LimiteDeteccionService } from '../../../../services/validacion-demetodos/limite-deteccion.service';
import { NotificationService } from '../../../../shared/notification';
import { sampleStandardDeviation } from 'simple-statistics';
import { Limites } from '../../../../models/Limites';
@Component({
  selector: 'app-limites',
  templateUrl: './limites.component.html',
  styleUrls: ['./limites.component.scss',
    '../../../../../assets/icon/icofont/css/icofont.scss']
})
export class LimitesComponent implements OnInit {
  @Input() id: string = '';
  @Input() limiteTecion: boolean;
  @Input() banco_muestras: boolean;
  @Input() limite_deteccion: boolean;
  @Input() limite_cuantificacion: boolean;
  @Input() permisosLocal: any;
  @Output() Guardado: EventEmitter<any> = new EventEmitter();
  NB = false;
  calcularMatriz = [];
  ArrLOD_LOQ = {
    DatosCorigan: '',
    n: 0,
    nb: 0,
    Matriz: [],
    factorLimiteCuantificacion: 0,
    factorLimiteDetencion: 0,
    id_validacionMetodo: '',
    _id: '',
    fLdeteccion: 0,
    fLquantificacion: 0
  };
  formaLimiteDeteccionCuantificacion: FormGroup;
  fLdeteccion = 0;
  fLquantificacion = 0;
  btnLOD_LOQ = false;
  edit: boolean;
  helperActive: boolean = false;
  contentTable: boolean = false;
  helper: string;
  constructor(
    private LOD_LOQService: LimiteDeteccionService,
    private fb: FormBuilder,
    private notificationService: NotificationService) {
    this.edit = false;
  }
  content(){
    if (this.contentTable) {
      this.contentTable = false;
    }else {
      this.contentTable = true;
    }
  }
  edicion() {
    if (this.edit) {
      this.edit = false;
    } else {
      this.edit = true;
    }
  }
  ngOnInit() {
    this.formaLimiteDeteccionCuantificacion = new FormGroup({
      matriz: new FormControl('', Validators.required),
      unidad: new FormControl(''),
      factorLimiteDetencion: new FormControl('', Validators.required),
      factorLimiteCuantificacion: new FormControl('', Validators.required),
      usaBlanco: new FormControl('No', Validators.required),
      n: new FormControl('1', [Validators.required, Validators.min(1)]),
      nb: new FormControl('1', [Validators.required, Validators.min(1)]),
      arrs1: this.fb.array([])
    });
    this.cargarLimites();
    // console.log(this.ArrLOD_LOQ)
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

  addinput(index) {
    const control1 = <FormArray>this.formaLimiteDeteccionCuantificacion.controls['arrs1'];
    control1.insert(index + 1, this.fb.group({ arr1: [``] }));
  }
  removeDato(index: number, array: string) {
    this.eliminarPosicon(index, array);
  }
  usaBlanco(valr: string) {
    if (valr === 'Si') {
      this.NB = true;
    } else {
      this.NB = false;
    }
  }
  usaMatrisBlancos(elemento, variable) {
    switch (variable) {
      case 'ldtyc':
        if (elemento) {
          this.limiteTecion = false;
        } else {
          this.limiteTecion = true;
        }
        break;
    }
  }
  clickBoton(idenificador): void {
    document.getElementById(idenificador).click();
  }
  llenadoArreglo(arreglo, valores) {
    switch (arreglo) {
      case 'arr1':
        valores.forEach(element => {
          const control = <FormArray>this.formaLimiteDeteccionCuantificacion.controls['arrs1'];
          control.push(this.fb.group({ arr1: [`${element}`] }));
        });
        break;
      default:
        break;
    }
  }
  get arr1() {
    return this.formaLimiteDeteccionCuantificacion.get('arrs1') as FormArray;
  }
  eliminarPosicon(index: number, array: string) {
    let control;
    switch (array) {
      case 'arr1':
        control = <FormArray>this.formaLimiteDeteccionCuantificacion.controls['arrs1'];
        control.removeAt(index);
        break;
    }
  }
  llenadoDeArrayCalculos(forma, tipoCalculo: string) {
    // console.log(forma.value);
    this.calcularMatriz = [];
    if (tipoCalculo === 'LOD_LOQ') {
      this.calculoLOD_LOQ(this.calcularMatriz, 'LOD_LOQ');
    }
  }
  calculoLOD_LOQ(matriz, calculo) {
    console.log(this.formaLimiteDeteccionCuantificacion.value.arrs1)
    if (!this.limiteTecion) {
      this.calcularMatriz = [];
      this.formaLimiteDeteccionCuantificacion.value.arrs1.forEach(element => {
        this.calcularMatriz.push(parseFloat(element['arr1']));
      });
    }
    let s0;
    const n = this.formaLimiteDeteccionCuantificacion.value.n;
    const nb = this.formaLimiteDeteccionCuantificacion.value.nb;
    if (this.formaLimiteDeteccionCuantificacion.value.usaBlanco === 'No') {
      s0 = (sampleStandardDeviation(this.calcularMatriz) / Math.sqrt(n));
    } else {
      s0 = sampleStandardDeviation(this.calcularMatriz) * Math.sqrt((1 / n) + (1 / nb));
    }
    this.fLdeteccion = s0 * parseFloat(this.formaLimiteDeteccionCuantificacion.value.factorLimiteDetencion);
    this.fLquantificacion = s0 * parseFloat(this.formaLimiteDeteccionCuantificacion.value.factorLimiteCuantificacion);
    this.btnLOD_LOQ = true;
  }
  // Funciones de Bases De Datos
  cargarLimites() {
    this.LOD_LOQService.get(this.id).subscribe((resp: any) => {
      // console.log(resp);
      
      if (resp.success) {
        if (resp.Limites.length > 0) {
          this.ArrLOD_LOQ = resp.Limites[0];
          // console.log(this.ArrLOD_LOQ)
          this.formaLimiteDeteccionCuantificacion.setValue({
            matriz: '',
            unidad: this.ArrLOD_LOQ['unidad'],
            factorLimiteDetencion: this.ArrLOD_LOQ['factorLimiteDetencion'],
            factorLimiteCuantificacion: this.ArrLOD_LOQ['factorLimiteCuantificacion'],
            usaBlanco: 'Si',
            n: this.ArrLOD_LOQ['n'],
            nb: this.ArrLOD_LOQ['nb'],
            arrs1: []
          });
          this.llenadoArreglo('arr1', this.ArrLOD_LOQ['Matriz']);
          this.limiteTecion = false;
          // this.clickBoton('btn-LOD_LOQ');
          this.fLdeteccion = this.ArrLOD_LOQ.fLdeteccion;
          this.fLquantificacion = this.ArrLOD_LOQ.fLquantificacion;
          const LOD_LOQ = {
            guardado:false,
            LOD_LOQ: true,
            arr: this.ArrLOD_LOQ  
          };
          this.Guardado.emit(LOD_LOQ);
        }
      } else {
        this.ArrLOD_LOQ = {
          DatosCorigan: '',
          n: 0,
          nb: 0,
          Matriz: [],
          factorLimiteCuantificacion: 0,
          factorLimiteDetencion: 0,
          id_validacionMetodo: '',
          _id: '',
          fLdeteccion: 0,
          fLquantificacion: 0
        };
        const LOD_LOQ = {
          guardado:false,
          LOD_LOQ: false,
          arr: []  
        };
        this.Guardado.emit(LOD_LOQ);
      }
    });
  }
  EliminarLimites() {
    this.LOD_LOQService.delete(this.ArrLOD_LOQ._id).subscribe((resp: any) => {
      if (resp.success) {
        this.notificationService.addNotify({ title: 'Limiotes de Tección', msg: resp.message, type: 'success' });
      } else {
        this.notificationService.addNotify({ title: 'Limiotes de Tección', msg: resp.message, type: 'error' });
      }
    });
  }
  guardarLOD_LOQ(): void {
    // console.log(this.formaLimiteDeteccionCuantificacion.value)
    if (this.ArrLOD_LOQ['_id'] === '') {
      this.ArrLOD_LOQ['DatosCorigan'] = '';
      this.ArrLOD_LOQ['unidad'] = this.formaLimiteDeteccionCuantificacion.value.unidad;
      this.ArrLOD_LOQ['n'] = parseFloat(this.formaLimiteDeteccionCuantificacion.value.n);
      this.ArrLOD_LOQ['nb'] = parseFloat(this.formaLimiteDeteccionCuantificacion.value.nb);
      this.ArrLOD_LOQ['factorLimiteDetencion'] = parseFloat(this.formaLimiteDeteccionCuantificacion.value.factorLimiteDetencion);
      this.ArrLOD_LOQ['factorLimiteCuantificacion'] = parseFloat(this.formaLimiteDeteccionCuantificacion.value.factorLimiteCuantificacion);
      this.ArrLOD_LOQ['id_validacionMetodo'] = this.id;
      this.ArrLOD_LOQ['Matriz'] = this.calcularMatriz;
      this.ArrLOD_LOQ['fLquantificacion'] = this.fLquantificacion;
      this.ArrLOD_LOQ['fLdeteccion'] = this.fLdeteccion;
      this.LOD_LOQService.create(this.ArrLOD_LOQ).subscribe((resp: any) => {
        if (resp.success) {
          this.ArrLOD_LOQ = resp.LimiteStored;
          const LOD_LOQ = {
            guardado:true,
            LOD_LOQ: true,
            arr: this.ArrLOD_LOQ  
          };
          this.Guardado.emit(LOD_LOQ);
          this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'success' });
        } else {
          const LOD_LOQ = {
            guardado:false,
            LOD_LOQ: false,
            arr: []  
          };
          this.Guardado.emit(LOD_LOQ);
          this.notificationService.addNotify({ title: 'Alerta', msg: resp.error, type: 'error' });
        }
      });
    } else {
      this.ArrLOD_LOQ['DatosCorigan'] = '';
      this.ArrLOD_LOQ['unidad'] = this.formaLimiteDeteccionCuantificacion.value.unidad;
      this.ArrLOD_LOQ['n'] = parseFloat(this.formaLimiteDeteccionCuantificacion.value.n);
      this.ArrLOD_LOQ['nb'] = parseFloat(this.formaLimiteDeteccionCuantificacion.value.nb);
      this.ArrLOD_LOQ['factorLimiteDetencion'] = parseFloat(this.formaLimiteDeteccionCuantificacion.value.factorLimiteDetencion);
      this.ArrLOD_LOQ['factorLimiteCuantificacion'] = parseFloat(this.formaLimiteDeteccionCuantificacion.value.factorLimiteCuantificacion);
      this.ArrLOD_LOQ['id_validacionMetodo'] = this.id;
      this.ArrLOD_LOQ['Matriz'] = this.calcularMatriz;
      this.ArrLOD_LOQ['fLquantificacion'] = this.fLquantificacion;
      this.ArrLOD_LOQ['fLdeteccion'] = this.fLdeteccion;
      this.LOD_LOQService.edit(this.ArrLOD_LOQ).subscribe((resp: any) => {
        this.ArrLOD_LOQ.id_validacionMetodo = this.id;
        this.ArrLOD_LOQ = resp.Limite;
        // console.log(resp)
        if (resp.success) {
          const LOD_LOQ = {
            guardado:true,
            LOD_LOQ: true,
            arr: this.ArrLOD_LOQ  
          };
          this.Guardado.emit(LOD_LOQ);
          this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'success' });
        } else {
          const LOD_LOQ = {
            guardado:false,
            LOD_LOQ: false,
            arr: []  
          };
          this.Guardado.emit(LOD_LOQ);
          this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'error' });
        }
      });
    }
  }
  help(type: string){
    this.helperActive = true;
    switch (type) {
      case '1':
        this.helper = '1';
    
        //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor1
        break;
      case '2':
        this.helper = '2';
        //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
        break
      case '3':
      this.helper = '3';
      //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
      break
      case '4':
      this.helper = '4';
      //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
      break
      case '5':
      this.helper = '5';
      //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
      break
      case '6':
      this.helper = '6';
      //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
      break
    }
  }
}
