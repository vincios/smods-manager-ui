import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModActionsComponent } from './mod-actions/mod-actions.component';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { SimpleChipComponent } from './simple-chip/simple-chip.component';
import { ModOperationsComponent } from './mod-operations/mod-operations.component';
import { StyleSelectComponent } from './style-select/style-select.component';
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    ModActionsComponent,
    SimpleChipComponent,
    ModOperationsComponent,
    StyleSelectComponent
  ],
    imports: [
        CommonModule,
        MaterialModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [
        ModActionsComponent,
        SimpleChipComponent,
        ModOperationsComponent,
        StyleSelectComponent
    ]
})
export class ComponentsModule { }
