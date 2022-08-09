import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ModComponent } from './mod/mod.component';
import { ComponentsModule } from '../components/components.module';
import {SharedModule} from "../shared/shared.module";
import {MaterialModule} from "../material/material.module";
import {RouterModule} from "@angular/router";
import { SettingsComponent } from './settings/settings.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";



@NgModule({
    providers: [
        { provide: MatDialogRef, useValue: null }, // When a page that could be also a dialog is opened as page, we provide an empty MatDialogRef to it
        { provide: MAT_DIALOG_DATA, useValue: [] } // When a page that could be also a dialog is opened as page, we provide an empty MAT_DIALOG_DATA to it
    ],
    declarations: [
        HomeComponent,
        ModComponent,
        SettingsComponent
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        SharedModule,
        MaterialModule,
        RouterModule,
        ReactiveFormsModule,
    ]
})
export class PagesModule { }
