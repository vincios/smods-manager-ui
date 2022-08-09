import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {FullMod, ModBase, ModRevision, ModStatus, TaskOperation} from 'src/app/model/model';
import { AppService } from 'src/app/providers/app.service';
import { modTypeString } from 'src/app/commons/utils';
import { MatSelect } from '@angular/material/select';
import find from 'lodash-es/find';
import remove from 'lodash-es/remove'
import values from 'lodash-es/values'
import { WebsocketService } from 'src/app/providers/websocket.service';
import { Subscription } from 'rxjs';
import {MatTooltip} from "@angular/material/tooltip";

@Component({
    selector: 'app-mod-actions',
    templateUrl: './mod-actions.component.html',
    styleUrls: ['./mod-actions.component.scss']
})
export class ModActionsComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() mod: ModBase | FullMod | undefined;
    @Input() direction: "horizontal" | "vertical" = "vertical";

    @ViewChild('selector') revisionSelector: MatSelect | undefined;
    @ViewChild('errorTooltip') errorTooltip: MatTooltip | undefined;

    // we could subscribe to more status, so we save all the subscriptions to an array
    statusSockets: {[mod_id: string]: Subscription} = {}

    modStatus: ModStatus = {
        "installed": null,
        "downloaded": null,
        "installing": false,
        "playlists": [],
        "starred": false,
    };

    selectedRevision: string = "";

    isLoadingRevisions = false;
    loadedRevisions: ModRevision[] | undefined;

    // we could store at most two status operation: one for the installing mod and one fot the installing dependency
    operationsObjectsList: TaskOperation[] = []

    // operationsObjectsList: TaskOperation[] = [{
    //   "op":"install",
    //   "state":"unzip",
    //   "mod":{
    //     "published_date":"2022-07-22T00:00:00",
    //     "steam_url":"https://steamcommunity.com/workshop/filedetails/?id=407000955",
    //     "latest_revision":{
    //       "download_url":"https://modsbase.com/ynbjb931r1ir/407000955_mega_tower_Atlantic_1.zip.html",
    //       "filename":"407000955_mega_tower_Atlantic_1.zip",
    //       "date":"2015-03-13T09:34:00",
    //       "id":"61c9610ac7",
    //       "name":"13 Mar, 2015 at 09:34"
    //     },
    //     "size":"6.83 MB",
    //     "has_dependencies":false,
    //     "steam_id":"407000955",
    //     "authors":"['twitch.tv/EarnestBoon']",
    //     "url":"https://smods.ru/archives/85684",
    //     "id":"85684",
    //     "name":"mega tower Atlantic 1"
    //   },
    //   "revision":{
    //     "download_url":"https://modsbase.com/ynbjb931r1ir/407000955_mega_tower_Atlantic_1.zip.html",
    //     "filename":"407000955_mega_tower_Atlantic_1.zip",
    //     "date":"2015-03-13T09:34:00",
    //     "id":"61c9610ac7",
    //     "name":"13 Mar, 2015 at 09:34"
    //   }
    // },
    //   {
    //     "op":"install",
    //     "state":"unzip",
    //     "mod":{
    //       "published_date":"2022-07-22T00:00:00",
    //       "steam_url":"https://steamcommunity.com/workshop/filedetails/?id=407000955",
    //       "latest_revision":{
    //         "download_url":"https://modsbase.com/ynbjb931r1ir/407000955_mega_tower_Atlantic_1.zip.html",
    //         "filename":"407000955_mega_tower_Atlantic_1.zip",
    //         "date":"2015-03-13T09:34:00",
    //         "id":"61c9610ac7",
    //         "name":"13 Mar, 2015 at 09:34"
    //       },
    //       "size":"6.83 MB",
    //       "has_dependencies":false,
    //       "steam_id":"407000955",
    //       "authors":"['twitch.tv/EarnestBoon']",
    //       "url":"https://smods.ru/archives/85684",
    //       "id":"85684",
    //       "name":"mega tower Atlantic 1"
    //     },
    //     "revision":{
    //       "download_url":"https://modsbase.com/ynbjb931r1ir/407000955_mega_tower_Atlantic_1.zip.html",
    //       "filename":"407000955_mega_tower_Atlantic_1.zip",
    //       "date":"2015-03-13T09:34:00",
    //       "id":"61c9610ac7",
    //       "name":"13 Mar, 2015 at 09:34"
    //     }
    //   }]

    manualDownloadUrl: string | undefined;
    taskError: string | undefined;

    constructor(private app: AppService, private websocket: WebsocketService) { }

    ngAfterViewInit(): void {  }

    ngOnInit(): void {
        if (this.mod) {
            console.log("Latest Revision: ", this.mod.latest_revision);
            // this.selectedRevision = this.mod.latest_revision.id;
            this.app.getModStatus(this.mod?.id).subscribe((status) => {
                console.log(status);
                this.handleNewStatus(status);
            });

            this.statusSockets[this.mod.id] = this.websocket.subscribeForStatus(this.mod.id).subscribe((status: ModStatus) => {
                console.log("status: ", status);
                this.handleNewStatus(status);
            });
        }
    }


    ngOnDestroy(): void {
        // unsubscribe from all the websockets
        const wss = values(this.statusSockets);
        console.log(`Disconnecting from ${wss.length} websockets`, wss)
        wss.forEach((socket) => {
            socket.unsubscribe();
        });
    }

    handleNewStatus(status: ModStatus): void {
        this.modStatus = status;
        if (status.installed) {
            this.selectedRevision = status.installed.id;
        }
        if (status.operation) {
            this.handleOperation(status.operation);
        }
    }

    handleOperation(op: TaskOperation): void {
        // here we save the states that we want showed on installing mod line, also if it refers to another mod
        const alwaysOnInstallingMod = ['installing_dependency'];

        // if the operation mod is different, we have to subscribe or unsubscribe to the relative subject
        let otherMod: ModBase = (op['mod'] && op['mod'].id !== this.mod?.id) ? op['mod'] : null;

        if (op.state === "done" && otherMod) {
            this.statusSockets[otherMod.id].unsubscribe();
            delete this.statusSockets[otherMod.id];
        }
        else if (op.state === "installing_dependency" && otherMod) {
            this.statusSockets[otherMod.id] = this.websocket.subscribeForStatus(otherMod.id).subscribe((status: ModStatus) => {
                this.handleNewStatus(status);
            });
        }

        // we set the op object into the this.operationsObjectsList list
        let newOperationsList = [...this.operationsObjectsList];

        if (otherMod && !alwaysOnInstallingMod.includes(op.state)) { // the status refers to a dependency mod
            if (newOperationsList.length == 2) { // operationsObjectsList already have an object for the dependency -> we overwrite it
                newOperationsList[1] = op;
            } else if (newOperationsList.length == 1) {  // when another status arrives the this.operationsObjectsList must have at least one status for the root mod
                // operationsObjectsList doesn't have an object for the dependency -> we add it
                newOperationsList.push(op);
            } else {
                console.warn("When a operation object arrives for a dependency, the operationsObjectsList must have at least one " +
                    `object for the root mod, but in this case operationsObjectsList have ${this.operationsObjectsList.length} objects`);
            }
        } else { // the status refers to the installing mod (root mod)
            if (newOperationsList.length === 0) {
                newOperationsList.push(op);
            } else {
                newOperationsList[0] = op;
            }
        }

        this.operationsObjectsList = newOperationsList;

        // if the task state is "done" we remove the op object from operationsObjectsList
        if (op.state === "done") {
            let newOperationsList = [...this.operationsObjectsList];
            remove(newOperationsList, (iterOperation: TaskOperation) => iterOperation == op)
            this.operationsObjectsList = newOperationsList;
        }

        // if the state is "wait_for_file" we have to provide a download button
        if (op.state === "wait_for_file") {
            this.manualDownloadUrl = op['revision'].download_url;
        }
    }

    modTypeString(mod: ModBase | FullMod): "base" | "full" {
        return modTypeString(mod);
    }

    getOtherRevisions(): ModRevision[] {
        let to_return: ModRevision[] = [];

        if (this.mod && modTypeString(this.mod) === "full") {
            to_return = (this.mod as FullMod).other_revisions;
        } else if(this.mod && this.loadedRevisions) {
            to_return = this.loadedRevisions;
        }

        return to_return;
    }

    getRevisions(): ModRevision[] {
        if (this.mod) {
            if (this.getOtherRevisions()) {
                return [...this.getOtherRevisions(), ...[this.mod.latest_revision]]
            } else {
                return [this.mod.latest_revision]
            }
        }

        return [];
    }

    loadMoreRevisions(): void {
        if (!this.loadedRevisions && !this.isLoadingRevisions) {
            this.revisionSelector?.open();
            this.isLoadingRevisions = true;
            this.app.getModOtherRevisions((this.mod as FullMod).id).subscribe((revisions) => {
                this.loadedRevisions = revisions;
                this.isLoadingRevisions = false;
            })
        }
    }

    isInstalledRevisionInRevisionList(): boolean {
        return !!(this.modStatus.installed && (find(this.getRevisions(), {id: this.modStatus.installed.id}) !== undefined));
    }

    toggleStar(): void {
        this.modStatus.starred = !this.modStatus.starred;
    }

    openPlaylistDialog(): void {

    }

    installUninstall(): void {
        this.taskError = undefined;

        if (!this.modStatus.installing && !this.modStatus.installed) {
            // install
            this.install();
        } else if (!this.modStatus.installing && this.modStatus.installed) {
            // uninstall
            this.uninstall();
        }
    }

    install(): void {
        if (!this.selectedRevision) {
            this.taskError = "COMPONENTS.MOD_ACTIONS.ERRORS.NO_REVISION_SELECTED";
            this.errorTooltip?.show();
            return
        }

        if (this.mod) {
            this.app.install(this.mod.id, this.selectedRevision).subscribe({
                next: (result) => {
                    console.log(result.message);
                    if (result.message === "Accepted") {
                        this.modStatus.installing = true;
                    }
                },
                error: (error) => {
                    console.error(error.status, error.statusText, error.error);
                    this.taskError = "COMPONENTS.MOD_ACTIONS.ERRORS.REQUEST_ERROR";
                    this.errorTooltip?.show();
                }
            });
        }
    }

    private uninstall() {
        if (this.mod) this.app.uninstall(this.mod.id).subscribe({
            next: (result) => {
                console.log(result.message)
                if (result.message === "Accepted") {
                    this.modStatus.installing = true;
                }
            },
            error: (error) => {
                console.error(error.status, error.statusText, error.error);
                this.taskError = "COMPONENTS.MOD_ACTIONS.ERRORS.REQUEST_ERROR";
                this.errorTooltip?.show();
            }
        });
    }
}
