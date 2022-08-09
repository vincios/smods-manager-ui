import {Component, Input, OnInit} from '@angular/core';
import {TaskOperation} from "../../model/model";

@Component({
  selector: 'app-mod-operations',
  templateUrl: './mod-operations.component.html',
  styleUrls: ['./mod-operations.component.scss']
})
export class ModOperationsComponent implements OnInit {

  @Input() op: TaskOperation | undefined;
  @Input() showModName: boolean = false;

  progressbarPercentage: number = -1;

  constructor() { }

  ngOnInit(): void {
    this.handleOperationObject();
  }

  handleOperationObject(): void {
    let total = null;
    let done = null;

    if (this.op && (this.op.state === "downloading" || this.op.state === "copying")) {
      if (this.op['total_bytes'] && this.op['downloaded_bytes']) {
        total = this.op['total_bytes'];
        done = this.op['downloaded_bytes'];
      } else if (this.op['total_bytes'] && this.op['copied_bytes']) {
        total = this.op['total_bytes'];
        done = this.op['copied_bytes'];
      }
    }

    if (total && done) {
      const progress = Math.round((done / total) * 100);
      if (progress > this.progressbarPercentage) {
        this.progressbarPercentage = progress;
      }
    }
  }
}
