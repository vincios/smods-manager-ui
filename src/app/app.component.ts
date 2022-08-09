import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {StyleManagerService, StyleDefinition, TYPOGRAPHIES, THEMES} from "./providers/style-manager.service";
import {Preferences, PreferencesService} from "./providers/preferences.service";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {MatDialog} from "@angular/material/dialog";
import {SettingsComponent} from "./pages/settings/settings.component";
import has from "lodash-es/has";
import get from "lodash-es/get";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'smods-manager-ui';
    isDark = this.preferences.get('local.theme.isDark', false);

    themes = THEMES;
    typographies = TYPOGRAPHIES;

    currentTheme = this.styleManager.getDefaultTheme();
    currentTypography: StyleDefinition = this.styleManager.getDefaultTypography();

    constructor(translate: TranslateService, private preferences: PreferencesService, private styleManager: StyleManagerService,
                private iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, public dialog: MatDialog) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('en');
        // the lang to use, if the lang isn't available, it will use the current loader to get them
        // translate.use('en')

        iconRegistry.addSvgIcon('theme-example', sanitizer.bypassSecurityTrustResourceUrl('assets/img/theme-demo-box.svg'));
        iconRegistry.addSvgIcon('theme-example-circles', sanitizer.bypassSecurityTrustResourceUrl('assets/img/theme-demo-circles.svg'));

        const savedTheme = preferences.get('local.theme.isDark', false)
            ? preferences.get('local.theme.darkTheme')
            : preferences.get('local.theme.lightTheme');

        this.currentTheme = this.styleManager.getThemeByClassName(savedTheme) || this.styleManager.getDefaultTheme();

        this.preferences.preferencesChange.subscribe((preferences: Preferences) => {
            if(has(preferences, "local.theme.isDark")) {
                this.isDark = get(preferences, 'local.theme.isDark');
            }
        });

        let tmp: Preferences = {
            app: {
                csDataPath: "test2"
            }
        }

        // set(tmp, "test.error.lol", "should not work");
        // set(tmp, "local.theme.typography", "test");

        this.preferences.puts(tmp);
    }

    toggleDarkVariant() {
        this.isDark = !this.isDark;
        const current = this.preferences.get('local.theme.isDark', true); // we use true as
        this.preferences.put('local.theme.isDark', !current);
        this.preferences.save();
    }

    selectTheme(theme: StyleDefinition) {
        this.currentTheme = theme;
        this.preferences.put(`local.theme.${this.isDark ? 'dark': 'light'}Theme`, theme.className);
    }

    selectTypography(typography: StyleDefinition) {
        this.currentTypography = typography;
        this.preferences.put('local.theme.typography', typography.className)
    }

    openSettings() {
        this.dialog.open(SettingsComponent);
    }
}
