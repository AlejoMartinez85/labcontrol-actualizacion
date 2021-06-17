import { Component, OnInit, Output, AfterViewInit, OnDestroy, EventEmitter, Input, SimpleChanges, OnChanges } from '@angular/core';
import { EvaluarService } from '../../services/evaluar/evaluar.service';
import { NotificationService } from '../notification';
import { ButtonType } from '../../models/enums';
declare const MathQuill: any;

import * as $ from 'jquery';

@Component({
  selector: 'app-matheditor',
  templateUrl: './matheditor.component.html',
  styleUrls: ['./matheditor.component.scss']
})

export class MatheditorComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  MQ = null;
  mathField;
  buttons = [

    this.buildRegularButton('/'),
    this.buildRegularButton('*'),
    this.buildRegularButton('-'),
    this.buildRegularButton('+'),
    //funciones
    this.buildRegularButton('^', '<var>X<sup>n</sup>'),
    this.buildRegularButton('sqrt', '<span>&#8730;</span>'),
    //variables
    this.buildOperationalButton('Backspace', 'Borrar'),
  ];
  btnvariables = [];
  @Input() variables: any;
  @Input() formula: any;
  @Input() editable: boolean;
  @Output() changeFormula = new EventEmitter<string>();
  subscription: any;
  numberdoc = '';
  formulanoedit: any;
  constructor(private evaluarService: EvaluarService,
    private notificationService: NotificationService) {

    this.formulanoedit = this.formula;

  }

  ngOnInit() {
    this.numberdoc = document.querySelectorAll("[id*=math-field]").length + '_' + new Date().getTime();

    this.crearVariables();
  }
  crearVariables() {
    if (this.variables !== undefined && this.variables != null) {
      for (let i = 0; i < this.variables.length; i++) {
        let variable = this.variables[i];
        this.btnvariables.push(this.buildRegularButton(variable.simbolo));

      }
    }

  }


  ngAfterViewInit() {

    this.loadMathQuill();
    this.calcularFormula();


  }
  loadMathQuill() {
    this.mathField = document.getElementById(`math-field_${this.numberdoc}`);
    this.MQ = (window as any).MathQuill.getInterface(2);


    var latexSpan = document.getElementById(`latex_${this.numberdoc}`);
    var emitevent = this.changeFormula;
    var calcularFormula = this.calcularFormula.bind(this);
    var editable = this.editable;
    var formula = this.formulanoedit;

    var mathField = this.MQ.MathField(this.mathField, {
      spaceBehavesLikeTab: true, // configurable

      handlers: {
        edit: function () { // useful event handlers

          latexSpan.textContent = mathField.latex(); // simple API
          calcularFormula();

        }
      }
    });
    if (!this.editable) {
      $(`#math-field_${this.numberdoc}`).find("textarea").prop("disabled", true);
    }


  }

  onClickMathButton(e: any, button) {
    console.log(e, button);
    if (button.action === 'write') {
      this.MQ.MathField(this.mathField).write(button.content);
    } else if (button.action === 'cmd') {
      this.MQ.MathField(this.mathField).cmd(button.content);
    } else {
      this.MQ.MathField(this.mathField).keystroke(button.content);
    }
    this.MQ.MathField(this.mathField).focus();
    e.preventDefault();
  }
  private buildRegularButton(content: string, displayContent?: string) {
    return {
      displayContent: displayContent ? displayContent : content,
      content: content,
      type: ButtonType.REGULAR,
      action: 'cmd'
    };
  }
  private buildOperationalButton(content: any, iconId: any, iconType?: string) {
    return {
      content: content,
      displayContent: iconId,
      action: 'keystroke',
      iconId: iconId,
      iconType: iconType ? iconType : 'material',
      type: ButtonType.OPERATIONAL
    };
  }
  ngOnDestroy() {


  }
  public getFormula() {
    let formular = this.MQ.MathField(this.mathField).latex();
    return formular;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.MQ != undefined) {
      console.log('CAMBIO');
      // changes.prop contains the old and the new value...
      this.variables = changes.variables.currentValue;
      this.formulanoedit = this.formula;
      this.calcularFormula();
    }
  }
  calcularFormula() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    let formula;
    if (!this.editable) {
      if (this.formulanoedit != undefined) {
        this.formula = this.formulanoedit;
      } else {
        this.formulanoedit = this.formula;
      }

    }
    formula = this.getFormula();
    let item = {
      formula: { ecuacion: formula, variables: this.variables }
    };
    this.changeFormula.emit('Calculando .....');
    this.subscription = this.evaluarService.add(item).subscribe((value: any) => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Formula ealuada con exito', type: 'success' });
      this.changeFormula.emit(value.resultado);
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });


  }

}
