import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';
import { NgModel } from '@angular/forms';

declare var google: any;
declare let $: any;

@Directive({
  selector: '[googleplace]',
  providers: [NgModel],
  host: {
    '(input)': 'onInputChange()'
  }
})
export class GoogleplaceDirective {
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  modelValue: any;
  autocomplete: any;
  private _el: HTMLElement;


  constructor(el: ElementRef, private model: NgModel) {
    this._el = el.nativeElement;
    this.modelValue = this.model;
    var input = this._el;
    this.autocomplete = new google.maps.places.Autocomplete(input, {});
    google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
      // console.log("GoogleplaceDirective : place changed .. !!!")
      var place = this.autocomplete.getPlace();
      this.invokeEvent(place);
    });

    setTimeout(function() {
      console.log("GoogleplaceDirective : invoked .. !!!")
      $(".pac-container").prependTo(input.parentElement);
    }, 1500);
  }

  invokeEvent(place: any) {
    var _place = {
      name : place['name'],
    }
    _place['latitude'] = place.geometry.location.lat();
    _place['longitude'] = place.geometry.location.lng();
    this.setAddress.emit(_place);
  }


  onInputChange() {
  }
}