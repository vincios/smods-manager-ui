import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatChipsModule} from '@angular/material/chips';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from "@angular/material/menu";
import {MatInputModule} from "@angular/material/input";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatSelectModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatProgressBarModule,
        MatChipsModule,
        MatTooltipModule,
        MatListModule,
        MatMenuModule,
        MatInputModule,
        MatSlideToggleModule,
        MatDialogModule,
        MatSnackBarModule,
    ],
    exports: [
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatSelectModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatProgressBarModule,
        MatChipsModule,
        MatTooltipModule,
        MatListModule,
        MatMenuModule,
        MatInputModule,
        MatSlideToggleModule,
        MatDialogModule,
        MatSnackBarModule,
    ]
})
export class MaterialModule { }
