import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReversePipe } from './pipes/reverse.pipe';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ReversePipe
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      extend: true,
      isolate: false,
    }),
  ],
  exports: [
    ReversePipe,
    TranslateModule
  ]
})
export class SharedModule { }
