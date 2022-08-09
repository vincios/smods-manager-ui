import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-simple-chip',
  template: `
    <span [ngClass]="['color-box', color, size]"><ng-content></ng-content></span>
  `,
  styleUrls: ['./simple-chip.component.scss']
})
export class SimpleChipComponent implements OnInit {

  @Input() color: "primary" | "accent" | "warn" = "primary";
  @Input() size: "small" | "normal" | "big" = "normal";

  constructor() { }

  ngOnInit(): void {
  }

}
