import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {PreferenceDefinition, PREFERENCES_STRUCTURE, PreferencesService} from "../../providers/preferences.service";
import {openSnackbar, paths} from "../../commons/utils";
import get from "lodash-es/get";
import set from 'lodash-es/set';
import {Subscription} from "rxjs";
import {MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    providers: [
    ]
})
export class SettingsComponent implements OnInit, OnDestroy {

    private _preferenceServiceSubscription: Subscription | undefined;
    private _valueChangeSubscriptions: Subscription[] = [];

    isDialog = false;

    settingsFormGroup: FormGroup = this.fb.group({});
    settingsPaths: string[][] = []
    settingsSectionsPaths: string[][] = [];

    constructor(private fb: FormBuilder, private preferencesService: PreferencesService,
                private dialogRef: MatDialogRef<SettingsComponent>, private snackBar: MatSnackBar,
                private translate: TranslateService,
    ) {
        this.createFormGroup();

        // MatDialogRef is null when the component is loaded as a normal web page instead of a dialog component (see pages.module.ts)
        if (dialogRef) {
            this.isDialog = true;
        }
    }

    ngOnInit(): void {
        this._preferenceServiceSubscription = this.preferencesService.preferencesChange.subscribe((newPreferences) => {
            this.settingsFormGroup.patchValue(newPreferences, {emitEvent: true});
        });

        const subscription = this.settingsFormGroup.get('local.theme.syncDarkThemeWithOs')?.valueChanges.subscribe((syncDarkThemeWithOs) => {
            if (syncDarkThemeWithOs) {
                this.settingsFormGroup.get("local.theme.isDark")?.disable();
            } else {
                this.settingsFormGroup.get("local.theme.isDark")?.enable();
            }
        });

        if (subscription) this._valueChangeSubscriptions.push(subscription);


        this.settingsFormGroup.patchValue(this.preferencesService.get());
    }

    ngOnDestroy() {
        if (this._preferenceServiceSubscription) {
            this._preferenceServiceSubscription.unsubscribe();
        }
        for (const subscription of this._valueChangeSubscriptions) {
            subscription?.unsubscribe();
        }
    }

    createFormGroup() {
        const settingsControls = {};
        const settingsStructure = PREFERENCES_STRUCTURE;
        const isLeaf = (node) => node instanceof PreferenceDefinition;  // In PREFERENCES_STRUCTURE a leaf is a value instance of PreferenceDefinition


        const settingPaths = paths(settingsStructure, true, true, isLeaf);
        // we sort the setting groups paths in descending path length order, because we want then create the controls from the inners to outers
        const settingsGroupsPaths = paths(settingsStructure, false, false, isLeaf).sort((a, b) => b.length - a.length);

        for (const path of settingPaths) {
            let formDefaultState: any = undefined;
            const settingDefinition: PreferenceDefinition = get(settingsStructure, path);
            const validators: ValidatorFn[] = [];

            switch (settingDefinition.type) {
                case 'boolean': formDefaultState = false; break;
                case 'number': formDefaultState = 0; break;
                default: formDefaultState = ''; break; // we treat other cases (including 'string' as strings)
            }

            if (settingDefinition.required) {
                validators.push(Validators.required);
            }

            set(settingsControls, path, this.fb.control(formDefaultState,{validators: validators}));
        }

        for(const path of settingsGroupsPaths) {
            // we replace each control into the settingControl paths with its ForumGroup version
            set(settingsControls, path, this.fb.group(get(settingsControls, path)));
        }

        this.settingsFormGroup = this.fb.group(settingsControls);
        this.settingsPaths = settingPaths;
        this.settingsSectionsPaths = settingsGroupsPaths;
    }

    getChildrenSectionPaths(sectionPath: string[]): string[][] {
        // We transform the array path to a string path to simplify the comparison
        // console.log(sectionPath);
        const sectionPathStr = sectionPath.join('.');
        return this.settingsSectionsPaths.filter((path) => {
            const pathStr = path.join('.');
            return path.length == sectionPath.length + 1 && pathStr.startsWith(sectionPathStr)
        });
    }

    getSectionSettings(settingPath: string[]): { path: string[]; name: string; definition: PreferenceDefinition }[] {
        const settingPathStr = settingPath.join('.');
        return this.settingsPaths.filter((path) => {
            const pathStr = path.join('.');
            return path.length == (settingPath.length + 1) && pathStr.startsWith(settingPathStr);
        }).map((path) => {
            return {
                path: path,
                name: this.getSectionNameFromPath(path),
                definition: get(PREFERENCES_STRUCTURE, path)
            }
        });
    }

    getFormGroup(sectionPath: string[]): FormGroup {
        return this.settingsFormGroup.get(sectionPath) as FormGroup || new FormGroup({});
    }

    getFormElement<T extends AbstractControl>(path: string[]): T {
        return (this.settingsFormGroup.get(path) as T);
    }

    getSectionNameFromPath(sectionPath: string[]) {
        return sectionPath.slice(-1).join('');
    }

    //https://stackoverflow.com/questions/50139508/input-loses-focus-when-editing-value-using-ngfor-and-ngmodel-angular5
    trackByFn(index, item) {
        return index;
    }

    savePreferences() {
        const preferences = this.settingsFormGroup.value;
        this.preferencesService.puts(preferences);
        this.preferencesService.save();
        this.settingsFormGroup.markAsPristine();

        openSnackbar(this.snackBar, this.translate.instant("PAGES.SETTINGS.SETTINGS_SAVED"), 5000);
        if (this.isDialog) {
            this.dialogRef.close();
        }
    }

}
