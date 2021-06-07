import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numeroPasteComaToPunto'
})
export class NumeroPasteComaToPuntoPipe implements PipeTransform {

  transform(value: string): any {
    if (value) {
      const numero = value.replace(",", ".");
      return numero;
    }

  }

}
