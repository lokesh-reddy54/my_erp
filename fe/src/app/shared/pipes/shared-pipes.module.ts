import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcerptPipe } from './excerpt.pipe';
import { IndianCurrency } from './inr.pipe';
import { EllipsesPipe } from './ellipses.pipe';
import { GetValueByKeyPipe } from './get-value-by-key.pipe';
import { RelativeTimePipe } from './relative-time.pipe';
import { GetMailNamePipe } from './get.mail.name';
import { SafeHtmlPipe } from './safe.html.pipe';
import { ToArrayPipe } from './toarray.pipe';
import { CapitalisePipe } from './capitalise.pipe';
import { NumberPipe } from './number.pipe';

const pipes = [
  IndianCurrency,
  ExcerptPipe,
  GetValueByKeyPipe,
  RelativeTimePipe,
  GetMailNamePipe,
  SafeHtmlPipe,
	EllipsesPipe,
  ToArrayPipe,
  NumberPipe,
  CapitalisePipe
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: pipes,
  exports: pipes
})
export class SharedPipesModule { }
