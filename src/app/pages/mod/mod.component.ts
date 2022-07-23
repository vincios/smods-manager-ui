import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FullMod, ModBase } from 'src/app/model/model';
import { AppService } from 'src/app/providers/app.service';

@Component({
  selector: 'app-mod',
  templateUrl: './mod.component.html',
  styleUrls: ['./mod.component.scss']
})
export class ModComponent implements OnInit {
  
  mod: FullMod | undefined;
  error: string | undefined;
  
  constructor(
    private readonly route: ActivatedRoute,
    private app: AppService
    ) { }

  ngOnInit(): void {
    console.log("loading mod");
    const id = this.route.snapshot.paramMap.get("id");
    console.log(id);
    if (id) {
      this.app.getFullMod(id).subscribe((mod) => {
        this.mod = mod;
      });
    } else {
      this.error = "Please give a mod id"
    }
  }

}
