import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FullMod} from 'src/app/model/model';
import {AppService} from 'src/app/providers/app.service';

@Component({
    selector: 'app-mod',
    templateUrl: './mod.component.html',
    styleUrls: ['./mod.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ModComponent implements OnInit {

    mod: FullMod | undefined;
    error: string | undefined;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private app: AppService ) {
        this.activatedRoute.params.subscribe( (data) => {
            this.mod = undefined;
            // const id = this.activatedRoute.snapshot.paramMap.get("id");
            const id = data['id'];
            if (id) {
                this.app.getFullMod(id).subscribe((mod) => {
                    this.mod = mod;
                });
            } else {
                this.error = "Please give a mod id"
            }
        })
    }

    ngOnInit(): void {
    }

}
