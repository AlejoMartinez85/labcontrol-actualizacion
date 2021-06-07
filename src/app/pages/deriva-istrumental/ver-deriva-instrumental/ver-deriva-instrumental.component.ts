import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DerivaIstrumentalService } from '../../../services/deriva-istrumental/deriva-istrumental.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { mean, sampleStandardDeviation, min, max } from 'simple-statistics';
import { materialize } from 'rxjs/operators';
import { EstimacionModel } from '../../../models/estimacion';


@Component({
  selector: 'app-ver-deriva-instrumental',
  templateUrl: './ver-deriva-instrumental.component.html',
  styleUrls: ['./ver-deriva-instrumental.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class VerDerivaInstrumentalComponent implements OnInit {
  $identificador: string;
  forma: FormGroup;
  annos = [];
  exactitud = [];
  puntosCalibraqcion = [];
  puntosForAnnio = {};
  preloader = true;
  estimacion = false;
  datosCalibracion = [];
  estimacon: EstimacionModel;
  datosCalculados = {};
  datos = [];
  periodosCalibracion = [];
  options;
  chart1;
  resultadoFinal = 0;
  year =0;
  months=0;
  constructor(private router: ActivatedRoute, private derivadaService: DerivaIstrumentalService, private fb: FormBuilder) {
    this.$identificador = this.router.snapshot.paramMap.get('id');
  }
  ngOnInit() {
    this.cargaDatos();
    this.cargarForms();
    this.preloader = false;
  }

  openModal(element) {
    document.querySelector('#' + element).classList.add('md-show');
  }
  cargarForms() {
    this.forma = new FormGroup({
      annos: this.fb.array([this.fb.group({ anno: [''] })])
    });
  }
  get getValores() {
    return this.forma.get('annos') as FormArray;
  }
  addValorAnno() {
    const control = <FormArray>this.forma.controls['annos'];
    control.push(this.fb.group({ anno: ['2015'] }));
  }
  removeAnno(index: number) {
    const control = <FormArray>this.forma.controls['annos'];
    control.removeAt(index);
  }
  removeValor(index: number) {
    const i = this.datosCalibracion.indexOf(index);
    this.datosCalibracion.splice(i, 1);
  }
  guardarAnnos() {
    this.forma.value.annos.forEach(element => {
      this.preloader = true;
      this.derivadaService.addAnnoPuntoDerivadaInstrumental(
        {
          anno: element['anno'],
          id_puntoCalibracion: this.$identificador
        }
      ).subscribe(resp => {
      });
    });
    this.preloader = false;
    window.location.reload();
  }

  cargaDatos() {
    this.derivadaService.getAllAnnoPuntoDerivadaInstrumentalID(this.$identificador).subscribe(annosResponse => {
      this.annos = annosResponse['Annos'];
      this.preloader = true;
      this.annos.forEach(valor => {
        this.derivadaService.getAllAnioValorPuntoDerivadaInstrumentalID(valor['_id']).subscribe(valores => {
          this.puntosForAnnio[valor.anno] = valores['ValoresAnnos'];
          this.preloader = false;
        });
      });
    });
    this.derivadaService.getAllexactitudPuntoDerivadaInstrumentalID(this.$identificador).subscribe(puntos => {
      this.preloader = true;
      this.exactitud = puntos['puntos'];
      this.preloader = false;
      // console.log(this.exactitud);
    });
    this.derivadaService.getAllEstimacionPuntoDerivadaInstrumentalID(this.$identificador).subscribe(estimaciones => {
      this.preloader = true;
      this.estimacon = estimaciones['punto'];
      this.preloader = false;
      // console.log(this.estimacon);
    });
    this.derivadaService.getAllPuntoDerivadaInstrumentalID(this.$identificador).subscribe(puntosdecalibracion => {
      this.preloader = true;
      this.puntosCalibraqcion = puntosdecalibracion['puntos'];
      this.preloader = false;
      // console.log(this.puntosCalibraqcion);
    });
  }
  addAnio(id) {
    this.preloader = true;
    this.datosCalibracion.forEach((valor, index) => {
      this.derivadaService.addAnnoValorPuntoDerivadaInstrumental(
        {
          index: index,
          valor: parseFloat(valor),
          id_annopuntoCalibracion: id
        }
      ).subscribe(respose => {
        console.log(respose);
      });
    });
    this.cargaDatos();
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

  eliminaAnno(id) {
    console.log(id);
    this.derivadaService.getAllAnioValorPuntoDerivadaInstrumentalID(id).subscribe(valores => {
      this.preloader = true;
      if (valores['ValoresAnnos'].length > 0) {
        valores['ValoresAnnos'].forEach(element => {
          this.derivadaService.deleteAnnioValorPuntoDerivadaInstrumental(element['_id']).subscribe(message => {
            console.log(message);
          });
        });
      }
      this.derivadaService.deleteAnnioPuntoDerivadaInstrumental(id).subscribe(message => {
        this.preloader = false;
        console.log(message);
        window.location.reload();
      });
    });
  }
  editAnnio(id: string, valor) {
    this.preloader = true;
    this.derivadaService.editAnnioValorPuntoDerivadaInstrumental(id, { valor: parseFloat(valor.value) }).subscribe(message => {
      console.log(message);
      this.preloader = false;
    });
  }
  editPuntoCalibracion(id: string, valor) {
    this.preloader = true;
    console.log(id);
    console.log(valor.value);
    this.derivadaService.editPuntoDerivadaInstrumental(id, { valor: parseFloat(valor.value) }).subscribe(message => {
      console.log(message);
      this.preloader = false;
    });
  }
  editExactitud(id: string, valor) {
    this.preloader = true;
    this.derivadaService.editExactitudPuntoDerivadaInstrumental(id, { valor: parseFloat(valor.value) }).subscribe(message => {
      console.log(message);
      this.preloader = false;
    });
  }
  eliminaExactitud(id: string) {
    this.preloader = true;
    this.derivadaService.deleteExactutudPuntoDerivadaInstrumental(id).subscribe(message => {
      console.log(message);
      this.preloader = false;
    });
  }
  deletePunto(id: string, i: number) {
    this.derivadaService.deletedPuntoDerivadaInstrumental(id).subscribe(mensaje => {
      this.derivadaService.deleteExactutudPuntoDerivadaInstrumental(this.exactitud[i]['_id']).subscribe(resp => { });
      this.annos.forEach(values => {
        this.derivadaService.deleteAnnioValorPuntoDerivadaInstrumental(this.puntosForAnnio[values.anno][i]['_id']).subscribe(resps => { });
      });
      window.location.reload();
    });
  }
  calcular() {
    for (let i = 0; i <= this.puntosCalibraqcion.length - 1; i++) {
      this.annos.forEach(values => {
        this.datos.push(this.puntosForAnnio[values.anno][i]['valor']);
      });
      this.datosCalculados[i] = this.datos;
      this.datos = [];
    }
    for (let a = 0; a <= this.puntosCalibraqcion.length - 1; a++) {
      this.periodosCalibracion.push(this.exactitud[a]['valor'] / (Math.abs(max(this.datosCalculados[a]) - min(this.datosCalculados[a]))));
    }
    this.resultadoFinal = min(this.periodosCalibracion);
    if(min(this.periodosCalibracion) > 1) {
      this.year = Math.floor(min(this.periodosCalibracion));
      this.months = min(this.periodosCalibracion) - Math.floor(min(this.periodosCalibracion));
      console.log(this.year);
      console.log(this.months)
    } else {
      this.resultadoFinal = min(this.periodosCalibracion);
    }
    this.grafica(this.puntosCalibraqcion);
  }
  grafica(puntosCalibraqcion) {
    const puntosReferencia = [];
    puntosCalibraqcion.forEach(element => {
      puntosReferencia.push(element.valor);
    });
    this.options = {
      series: [

      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [3, 3, 5, 1, 3, 3],
        curve: 'straight',
        dashArray: [0, 0, 0, 5, 5, 5]
      },
      title: {
        text: '',
        align: 'left'
      },
      legend: {
        tooltipHoverFormatter: function (val, opts) {
          return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
        }
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        categories: puntosReferencia,
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val) {
                return val + ' (mins)';
              }
            }
          },
          {
            title: {
              formatter: function (val) {
                return val + ' per session';
              }
            }
          },
          {
            title: {
              formatter: function (val) {
                return val;
              }
            }
          }
        ]
      },
      grid: {
        borderColor: '#f1f1f1',
      }
    };
    this.annos.forEach( values => {
      const data = [];
      this.puntosForAnnio[values.anno].forEach(element => {
        data.push(element.valor);
      });
      const serie = {
        name: values.anno,
        data: data
      };
      this.options.series.push(serie);
    });
    const ValExactutud = [];
    const ValExactutudNegative = [];
    this.exactitud.forEach( valoresExactitud => {
      ValExactutud.push(valoresExactitud.valor);
      ValExactutudNegative.push(valoresExactitud.valor * -1);
    })
    const exactitud = {
      name: 'Exactitud (+)',
      data: ValExactutud
    };
    this.options.series.push(exactitud);
    const exactitudNegativa = {
      name: 'Exactitud (-)',
      data: ValExactutudNegative
    };
    this.options.series.push(exactitudNegativa);
    this.chart1 = new ApexCharts(document.querySelector('#chart'), this.options);
    this.chart1.render();

    this.estimacion = true;
  }
}
