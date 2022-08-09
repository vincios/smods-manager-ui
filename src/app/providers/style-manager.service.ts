import { Injectable } from '@angular/core';
import {Preferences, PreferencesService} from "./preferences.service";
import has from "lodash-es/has";
import get from "lodash-es/get";

export interface StyleDefinition {
    /** Type of the style: theme or topography */
    type: "theme" | "typography";
    /** Displayed name */
    displayName: string;
    /** the class that needs to be set to activate the theme (the same used as selector into its .scss file) */
    className: string;
    /** css bundle file name AS IT WAS SET INTO THE angular.json FILE AND WITHOUT THE EXTENSION! */
    bundleName: string;
    /** set this to true only for the default theme */
    isDefault: boolean;
}

export const THEMES: StyleDefinition[] = [
    {
        // Type of the style: theme or topography
        type: "theme",
        // Displayed name
        displayName: "PinkGray",
        // the class that needs to be set to activate the theme (the same used as selector into its .scss file)
        className: "pink-gray",
        // css bundle file name AS IT WAS SET INTO THE angular.json FILE AND WITHOUT THE EXTENSION!
        bundleName: "theme-pink-gray",
        // set this to true only for the default theme
        isDefault: true,
    },
    {
        type: "theme",
        displayName: "PurpleTeal",
        className: "purple-teal",
        bundleName: "theme-purple-teal",
        isDefault: false,
    }
];

export const TYPOGRAPHIES: StyleDefinition[] = [
    {
        type: "typography",
        displayName: "Roboto",
        className:"roboto",
        "bundleName": "typography-roboto",
        isDefault: true,
    },
    {
        type: "typography",
        displayName: "Work Sans",
        className:"work-sans",
        "bundleName": "typography-work-sans",
        isDefault: false,
    }
];

@Injectable({
    providedIn: 'root'
})
export class StyleManagerService {
    isDark = false;
    currentTheme = "pink-gray";
    currentTypography = "roboto";

    constructor(private preferences: PreferencesService) {
        // At the app startup we set the theme and the variant given the saved preferences, and we set them again
        // each time the preferences change
        this.preferences.preferencesChange.subscribe((newPreferences) => {
            this.setFromPreferences(newPreferences);
        });

        this.setFromPreferences(this.preferences.get('local.theme'));
    }

    /**
     * Set the theme and the variant given the app configuration.
     * The <i>preferences</i> parameter can be a full preference object or only the values of the
     * 'local.theme' section of the full preference object.
     * If the <i>preferences</i> object doesn't define a preference, the default theme will be used (and the light variant)
     * @param preferences preferences to set
     */
    setFromPreferences(preferences: Preferences) {
        const defaultTheme = this.getDefaultTheme();
        const defaultTypography = this.getDefaultTypography();

        if (!defaultTheme || !defaultTypography) {
            return;
        }

        let lightThemePreference = undefined;
        let darkThemePreference = undefined;

        // the initial value of darkVariant is set to the current variant, so if into the preferences object
        // is not set a value for the variant, we use the current variant
        let darkVariant = this.isDark;

        let typographyPreference = undefined;

        for (let path of ['local.theme.lightTheme', 'lightTheme']) {
            if (has(preferences, path)) {
                lightThemePreference = get(preferences, path);
            }
        }

        for (const path of ['local.theme.darkTheme', 'darkTheme']) {
            if (has(preferences, path)) {
                darkThemePreference = get(preferences, path);
            }
        }

        for (const path of ['local.theme.isDark', 'isDark']) {
            if (has(preferences, path)) {
                darkVariant = get(preferences, path);
            }
        }

        for (const path of ['local.theme.typography', 'typography']) {
            if (has(preferences, path)) {
                // @ts-ignore the assignment type is correct
                typographyPreference = get(preferences, path);
            }
        }

        // we set the typography preference before the theme preference, because if the theme defines also a typography,
        // the last one wins, so in this way an (eventually) theme typography preference will override this
        if (!typographyPreference) {
            // if the given preferences object has no values for the preferred typography theme, we
            // take it from the preferences, and if neither the PreferencesService has a value, we use the default theme
            typographyPreference = this.preferences.get('local.theme.typography', defaultTypography.className);
            // this.setTypography(typographyPreference!);
        }
        this.setTypography(typographyPreference!);  // Non-null assertion operator assert that typographyPreference is not null, since we have defined a defaultValue in the line above

        // if the given preferences object has no values for the preferred light/dark theme, we
        // take it from the preferences, and if neither the PreferencesService has a value, we use the default theme
        if (darkVariant) {
            if (!darkThemePreference) {
                darkThemePreference = this.preferences.get('local.theme.darkTheme', defaultTheme.className);
            }
            this.setTheme(darkThemePreference!);
            this.setDarkVariant();
        } else {
            if (!lightThemePreference) {
                lightThemePreference = this.preferences.get('local.theme.lightTheme', defaultTheme.className);
            }
            this.setTheme(lightThemePreference!);
            this.setLightVariant();
        }
    }

    /**
     * Set a light or dark variant of the current theme, given the <i>dark</> parameter
     * @param dark variant to set: dark if true, light otherwise
     */
    setDarkOrLightVariant(dark: any) {
        if (dark) {
            this.setDarkVariant();
        } else {
            this.setLightVariant();
        }
    }

    /**
     * Set the dark variant of the current theme
     */
    setDarkVariant() {
        if (!document.body.classList.contains("dark")) {
            document.body.classList.add("dark");
            this.isDark = true;
        }
    }

    /**
     * Set the light variant of the current theme
     */
    setLightVariant() {
        if (document.body.classList.contains("dark")) {
            document.body.classList.remove("dark");
            this.isDark = false;
        }
    }

    /**
     * Toggle the current theme light/dark variants
     */
    toggleVariants() {
        if (this.isDark) {
            this.setLightVariant();
        } else {
            this.setDarkVariant();
        }
    }

    /**
     * This method set a theme of the themes list (identified by the given className attribute)
     * @param className
     */
    setTheme(className: string) {
        const oldTheme = THEMES.find((themeData) => {
            return themeData.className === this.currentTheme;
        });

        const newTheme = THEMES.find((themeData) => {
            return themeData.className === className;
        });

        if (!newTheme || !oldTheme) {
            console.error(`No theme found with identifier '${className}'`);
            return;
        }

        if (!newTheme.isDefault) {
            // Adds (or edit) the '<link />' html element into the head section of the page, to set the href of the css file.
            // We use a generic key 'theme' to identify the html element, so if it already exists into the page, we
            // can only update its href attribute, instead of create a new element
            this.setStyle('theme', `${newTheme.bundleName}.css`);

            // we have also set the theme className on the body element class list
            document.body.classList.add(newTheme.className);
        } else {
            // Since the default theme doesn't need to add a <link /> element to the head section, we remove the (eventually) existing
            // link elements (with 'theme' as key) if we want set the default theme
            this.removeStyle('theme');

            // in the same way, the default theme doesn't require a class on the body element, se we remove the current set class
            document.body.classList.remove(oldTheme.className);
        }

        this.currentTheme = className;
    }

    /**
     * Return the default theme
     */
    getDefaultTheme(): StyleDefinition {
        const found = THEMES.find(theme => theme.isDefault);

        if (!found) {
            console.error("No default theme set on the themes list. Maybe you forgot to set ones?");
            return {type: "theme", bundleName: "", className: "", isDefault: false, displayName: ""};
        }

        return found;
    }

    getThemeByClassName(className: string): StyleDefinition | undefined {
        return THEMES.find(theme => theme.className === className);
    }

    /**
     * This method set a typography configuration of the topographies list (identified by the given className attribute)
     * @param className
     */
    setTypography(className: string) {
        const oldTypo = TYPOGRAPHIES.find((typoData) => {
            return typoData.className === this.currentTypography;
        });

        const newTypo = TYPOGRAPHIES.find((typoData) => {
            return typoData.className === className;
        });

        if (!newTypo || !oldTypo) {
            console.error(`No typography found with identifier '${className}'`);
            return;
        }

        if (!newTypo.isDefault) {
            // Adds (or edit) the '<link />' html element into the head section of the page, to set the href of the css file.
            // We use a generic key 'typo' to identify the html element, so if it already exists into the page, we
            // can only update its href attribute, instead of create a new element
            this.setStyle('typography', `${newTypo.bundleName}.css`);

            // we have also set the typography className on the body element class list
            document.body.classList.add(newTypo.className);
        } else {
            // Since the default typography doesn't need to add a <link /> element to the head section, we remove the (eventually) existing
            // link elements (with 'typography' as key) if we want set the default typography
            this.removeStyle('typography');

            // in the same way, the default typography doesn't require a class on the body element, se we remove the current set class
            document.body.classList.remove(oldTypo.className);
        }

        this.currentTypography = className;
    }

    /**
     * Return the default theme
     */
    getDefaultTypography(): StyleDefinition {
        const found = TYPOGRAPHIES.find(typography => typography.isDefault);

        if (!found) {
            console.error("No default typography set on the typographies list. Maybe you forgot to set ones?");
            return {type: "typography", bundleName: "", className: "", isDefault: false, displayName: ""};
        }

        return found;
    }

    getTypographyByClassName(className: string): StyleDefinition | undefined {
        return TYPOGRAPHIES.find(typography => typography.className === className);
    }

    /**
     * Create a html <link /> html element on the head section of the html page, and set its href attribute to the given value.
     * It also set to the <link /> element a class with the given <i>key</i> (with a prefix) to identify the element into the html page.
     * In this way, if a <link /> element with the same key already exists into the page, this method only update its href
     * attribute, instead of create it again.
     * @param key key to identify the <link /> element
     * @param href href value to set
     * @private
     */
    private setStyle(key: string, href: string) {
        getLinkElementForKey(key).setAttribute('href', href);
    }

    /**
     * Remove the <link /> element identified by the <i>key</i> parameter
     * @param key identifier of the <link /> element to remove
     * @protected
     */
    protected removeStyle(key: string) {
        const existingLinkElement = getExistingLinkElementByKey(key);
        if (existingLinkElement) {
            document.head.removeChild(existingLinkElement);
        }
    }
}

/**
 * Create (or edit) a html link element on the head section of the html,
 * and sets to it a class with the specified key (with a prefix) (or use it to get the already created link element).
 * NB: It doesn't set the href attribute.
 * @param key the key that will be added to the link element's class list
 */
function getLinkElementForKey(key: string) {
    return getExistingLinkElementByKey(key) || createLinkElementWithKey(key);
}

function getExistingLinkElementByKey(key: string) {
    return document.head.querySelector(
        `link[rel="stylesheet"].${getClassNameForKey(key)}`
    );
}


function createLinkElementWithKey(key: string) {
    const linkEl = document.createElement('link');
    linkEl.setAttribute('rel', 'stylesheet');
    linkEl.classList.add(getClassNameForKey(key));
    document.head.appendChild(linkEl);
    return linkEl;
}

function getClassNameForKey(key: string) {
    return `style-manager-${key}`;
}
