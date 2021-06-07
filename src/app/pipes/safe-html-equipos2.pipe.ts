import {DomSanitizer} from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safeHtmlEquipos2'
})
export class SafeHtmlEquiposPipe2 implements PipeTransform {

  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    const valorFinal = this.sanitized.bypassSecurityTrustHtml(value)['changingThisBreaksApplicationSecurity'];
    if (valorFinal === undefined) {
      return '';
    } else {
      return this.sanitized.bypassSecurityTrustHtml(value);
    }
  }

}
