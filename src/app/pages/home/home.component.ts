import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {SettingsComponent} from "../settings/settings.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title =  "HOME"
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

    openDialog() {
        this.dialog.open(SettingsComponent);
    }
}
