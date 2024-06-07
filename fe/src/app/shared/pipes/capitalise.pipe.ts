import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({
  name: 'capitalise',
})
export class CapitalisePipe implements PipeTransform {

  constructor(private sanitizer:DomSanitizer){}

  transform(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

}