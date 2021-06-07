import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, FormControlDirective } from '@angular/forms';
import { DerivaIstrumentalService } from '../../../services/deriva-istrumental/deriva-istrumental.service';
import { DerivadaInstrumental } from '../../../models/derivada-instrumental';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-deriva-instrumental',
  templateUrl: './crear-deriva-instrumental.component.html',
  styleUrls: ['./crear-deriva-instrumental.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class CrearDerivaInstrumentalComponent implements OnInit {

  formCrearDerivada: FormGroup;
  forma: FormGroup;
  formaanno: FormGroup;
  derivadaInstrumental: DerivadaInstrumental;
  datosCalibracion = [];
  annos = [];
  preloader = false;
  datosforAnno = false;
  cantidadDatosCalibracion = 0;
  /**
   * Pasos
   */
  paso1: boolean = true;
  paso2: boolean = false;
  paso3: boolean = false;
  Annos: boolean = false;
  user: any;
  constructor(
    private derivadaService: DerivaIstrumentalService,
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.cargarFormularios();
  }

  cargarFormularios() {
    this.formCrearDerivada = new FormGroup({
      nombre: new FormControl('', Validators.required),
      parametroEnsayo: new FormControl('', Validators.required),
      equipo: new FormControl('', Validators.required),
    });
    this.forma = new FormGroup({
      annos: this.fb.array([this.fb.group({ anno: [''] })])
    });
    this.formaanno = new FormGroup({
      anno: new FormControl('')
    });
  }
  get getValores() {
    return this.forma.get('annos') as FormArray;
  }
  addValorAnno() {
    const control = <FormArray>this.forma.controls['annos'];
    control.push(this.fb.group({ anno: [] }));
  }
  removeAnno(index: number) {
    const control = <FormArray>this.forma.controls['annos'];
    control.removeAt(index);
  }
  guardarForm() {

    if (this.formCrearDerivada.valid) {
      this.preloader = true;
      const derivada = {
        nombre: this.formCrearDerivada.value.nombre,
        parametroEnsayo: this.formCrearDerivada.value.parametroEnsayo,
        equipo: this.formCrearDerivada.value.equipo,
        tercero: this.user.tercero._id,
        usuario: this.user._id
      };

      this.derivadaService.addDerivadaInstrumental(derivada).subscribe(derivadaCreada => {

        console.log(derivadaCreada);
        this.derivadaInstrumental = derivadaCreada['punto'];
        console.log(this.derivadaInstrumental);
        this.preloader = false;
        this.paso1 = false;
        this.paso2 = true;
      });
    }

  }

  data(event: ClipboardEvent) {
    this.datosCalibracion = [];
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    const row_data = pastedText.split('\n');
    row_data.forEach(valor => {
      valor = valor.replace(',', '.');
      this.datosCalibracion.push(parseFloat(valor));
    });
  }

  removeValor(index: number) {
    const i = this.datosCalibracion.indexOf(index);
    this.datosCalibracion.splice(i, 1);
  }

  addValorCampo(valor) {
    const valorModific = valor.value.replace(',', '.');
    this.datosCalibracion.push(parseFloat(valorModific));
  }

  guardarParametrosCalibracion() {
    this.cantidadDatosCalibracion = this.datosCalibracion.length;
    this.preloader = true;
    this.paso2 = false;
    this.datosCalibracion.forEach((valor, index) => {
      this.derivadaService.addPuntoDerivadaInstrumental(
        {
          valor: valor,
          index: index,
          id_puntoCalibracion: this.derivadaInstrumental['_id']
        }
      ).subscribe(resp => { });
    });
    this.paso3 = true;
    this.preloader = false;
    this.datosCalibracion = [];
  }

  openModal(element) {
    document.querySelector('#' + element).classList.add('md-show');
  }
  guardarAnnos() {
    this.forma.value.annos.forEach(element => {
      this.derivadaService.addAnnoPuntoDerivadaInstrumental(
        {
          anno: element['anno'],
          id_puntoCalibracion: this.derivadaInstrumental['_id']
        }
        ).subscribe(resp => {
          console.log(resp);
        });
    });
    this.preloader = false;
    document.querySelector('#modal-generico-agregar-annos').classList.remove('md-show');
    document.querySelector('#modal-generico-agregar-exactitud').classList.add('md-show');
    this.datosCalibracion = [];
  }
  guardarExactitudCalibracion() {
    this.preloader = true;
    for (let i = 0; i <= this.cantidadDatosCalibracion - 1; i++) {
      this.derivadaService.addexactitudPuntoDerivadaInstrumental(
        {
          index: i,
          valor: this.datosCalibracion[i],
          id_puntoCalibracion: this.derivadaInstrumental['_id']
        }
        ).subscribe(respose => {
          console.log(respose);
        });
      }
      this.preloader = false;
      document.querySelector('#modal-generico-agregar-exactitud').classList.remove('md-show');
      setTimeout(() => {
        this.router.navigate(['/config/derivada-instrumental/ver',  this.derivadaInstrumental['_id'] ]);
      }, 3000);
    }
}
