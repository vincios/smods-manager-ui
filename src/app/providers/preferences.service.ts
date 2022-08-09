import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import toPairs from "lodash-es/toPairs";
import get from "lodash-es/get"
import set from "lodash-es/set";
import has from "lodash-es/has";
import {paths} from "../commons/utils";
import merge from "lodash-es/merge";
import {THEMES, TYPOGRAPHIES} from "./style-manager.service";

export class PreferenceDefinition {
    type: "string" | "boolean" | "number" | "select";
    required?: boolean;


    private _choices: { value: string; text: string; }[] | undefined;
    get choices(): { value: string; text: string }[] | undefined {
        return this._choices;
    }
    set choices(list) {
        this._choices = list;
    }

    private _extra: any;
    get extra(): any {
        return this._extra;
    }
    set extra(extra: any) {
        this._extra = extra;
    }

    constructor(type: "string" | "boolean" | "number" | "select", required: boolean = false) {
        this.type = type;
        this.required = required;
        this.extra = {};
        this.choices = undefined;
    }

    setExtra(extra: any): PreferenceDefinition {
        this.extra = extra;
        return this;
    }

    setChoices(list: { value: string; text: string; }[]): PreferenceDefinition {
        this.choices = list;
        return this;
    }
}

export const PREFERENCES_STRUCTURE = {
    app: {
        csInstallPath: new PreferenceDefinition("string", true),
        csDataPath: new PreferenceDefinition("string", true)
    },
    local: {
        theme: {
            syncDarkThemeWithOs: new PreferenceDefinition("boolean"),
            isDark: new PreferenceDefinition("boolean"),
            lightTheme: new PreferenceDefinition("select")
                .setChoices(THEMES.map((t) => {
                    return {value: t.className, text: t.displayName}
                }))
                .setExtra({styles: THEMES}),
            darkTheme: new PreferenceDefinition("select")
                .setChoices(THEMES.map((t) => {
                    return {value: t.className, text: t.displayName}
                }))
                .setExtra({styles: THEMES}),
            typography: new PreferenceDefinition("select")
                .setChoices(TYPOGRAPHIES.map((t) => {
                    return {value: t.className, text: t.displayName}
                }))
                .setExtra({styles: TYPOGRAPHIES}),
        },
    }
}

export interface Preferences {
    local?: {
        theme?: {
            isDark?: boolean;
            lightTheme?: string;
            darkTheme?: string;
            typography?: string;
        },
        syncDarkThemeWithOs?: boolean,
    },
    app?: {
        csDataPath?: string,
        csInstallPath?: string,
    }
}

@Injectable({
    providedIn: 'root'
})
export class PreferencesService {
    private preferences: Preferences = { };
    private updatedCategories: string[] = [ ];

    preferencesChange = new Subject<Preferences>();

    constructor() {
        if (!Object.keys(this.preferences).length) {
            this.load();
        }
    }

    load(): void {
        const localPreferences: { [key: string]: any } = {};

        // load local preferences
        for (let i=0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                const value = localStorage.getItem(key);
                if (value) {
                    set(localPreferences, key, JSON.parse(value));
                }
            }
        }

        // TODO: load app preferences

        this.puts({local: localPreferences});
    }

    get(preferencePath?: string, defaultValue?: any): any {
        if (!preferencePath) {
            return this.preferences;
        }

        if (!has(PREFERENCES_STRUCTURE, preferencePath)) {
            console.error(`Invalid preference path: ${preferencePath}`);
            return;
        }

        return get(this.preferences, preferencePath, defaultValue);
    }

    put(preferencePath: string, value:any): void {
        if (!has(PREFERENCES_STRUCTURE, preferencePath)) {
            console.error(`Invalid preference path: ${preferencePath}`);
            return;
        }

        set(this.preferences, preferencePath, value);

        let toEmit = {};
        set(toEmit, preferencePath, value);
        this.preferencesChange.next(toEmit);

        let category = preferencePath.split(".")[0];
        if(!this.updatedCategories.includes(category)) {
            this.updatedCategories.push(category);
        }
    }

    puts(preferences: Preferences): void {
        const preferencesPaths = paths(preferences, true, true);
        const existingPreferences: Preferences = { }

        for (let p of preferencesPaths) {
            if (has(PREFERENCES_STRUCTURE, p)) {
                set(existingPreferences, p, get(preferences, p));
            } else {
                console.warn(`Invalid preference path ${p.join('.')} will be skipped`);
            }
        }

        this.preferences = merge(this.preferences, existingPreferences);
        this.preferencesChange.next(existingPreferences);

        for (let category of Object.keys(preferences)) {
            if (!this.updatedCategories.includes(category)) {
                this.updatedCategories.push(category);
            }
        }
    }

    save(): void {
        if (this.updatedCategories.includes('local')) {
            // save local preferences to local storage
            toPairs(this.preferences['local']).forEach(([key, value]) => {
                localStorage.setItem(key, JSON.stringify(value));
            })
        }

        if(this.updatedCategories.includes('app')) {
            // TODO: adds the save for app preferences
        }

        // once flushed the updated categories we can reset the list
        this.updatedCategories = [];
    }
}
