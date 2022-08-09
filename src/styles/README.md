_# Theming

From [this](https://indepth.dev/tutorials/angular/angular-material-theming-system-complete-guide) guide.

The `styles` folder contains the configurations and the themes defined for the application.
The following files define the theming system structure (inspired by the [official material.angular.io site](https://github.com/angular/material.angular.io/)):

- `src/styles.theme.scss`: this file set the default theming configuration. You shouldn't have the need to modify this file, unless if you want change the default theme (see the comments into the file)
- `src/_app-theme.scss`: this file defines the mixins that configure the theme for all components of this app that needs a theme configuration (i.e. that have a `.component-theme.scss` file). 
   If you create a new component, you have to include its color and typography mixins into the mixins of this file (see comments into this file). 

  Also, this file define some css rules that can be applied everywhere into the app
- `src/styles/themes`: this folder contains the .scss files that defines each theme (one per theme). If you want to define a new theme, you have to add here its definition. See the paragraph below.
- 

## Themes
In the `src/styles/themes` folder are defined the themes, one for each file.
An Angular Material theme is a SASS map that contains your color and typography choices (i.e. a map with two keys:
_color_ and _typography_).

### color
The _color_ entry is a map that defines the palettes for your theme.
To construct a theme, 2 palettes are required: `primary` and `accent`, and `warn` palette is optional.
A theme can have two variants, one light and one dark.

### typography
The _typography_ entry defines the typography configuration of the theme.

A typography configuration is a collection of all typography levels, contains the styles for each level, keyed by name.
A typography level is a collection of typographic styles rules (font family, font weight, font size, ...) that can be applied to a text.
Angular provides preconfigured levels, listed [here](https://material.angular.io/guide/typography#typography-levels) but the user can define other levels.

A typography config can be defined using the sass function `mat.define-typography-config()`, where you can set, as parameters, the font-family to use, and the style of each preconfigured typography level (or add new levels). Since each parameter is optional, calling it without parameters will define the default typography configuration. You can see it from the function signature:

```scss
@function define-typography-config(
  $font-family:   'Roboto, "Helvetica Neue", sans-serif',
  $display-4:     define-typography-level(112px, 112px, 300, $letter-spacing: -0.05em),
  $display-3:     define-typography-level(56px, 56px, 400, $letter-spacing: -0.02em),
  $display-2:     define-typography-level(45px, 48px, 400, $letter-spacing: -0.005em),
  $display-1:     define-typography-level(34px, 40px, 400),
  $headline:      define-typography-level(24px, 32px, 400),
  $title:         define-typography-level(20px, 32px, 500),
  $subheading-2:  define-typography-level(16px, 28px, 400),
  $subheading-1:  define-typography-level(15px, 24px, 400),
  $body-2:        define-typography-level(14px, 24px, 500),
  $body-1:        define-typography-level(14px, 20px, 400),
  $caption:       define-typography-level(12px, 20px, 400),
  $button:        define-typography-level(14px, 14px, 500),
  // Line-height must be unit-less fraction of the font-size.
  $input:         define-typography-level(inherit, 1.125, 400)
)
```


### Create a theme
To create a theme, follows these steps:

1. Create a SCSS file into the folder `src/styles/themes`, follow the name convention of the other files present in this folder. Into this new file:
   1. Adds the imports
       
        ```scss
        // src/styles/themes/_new-theme.scss

        @use "sass:map";
        @use '@angular/material' as mat;
        @use "../../app-theme" as app;
        ```

   2. Define the color palettes for the `primary` and `accent` (and, optionally, `warn`) colors

        ```scss
        $_purple-primary: mat.define-palette(mat.$purple-palette, 600, 400, 900);
        $_teal-accent: mat.define-palette(mat.$teal-palette, A700, 700, A400);
        $_orange-warn: mat.define-palette(mat.$orange-palette, 900, 700, A400);
        ```
        The `define-palette` SASS function accepts a color palette, as well as four optional hue numbers. 
        These four hues represent, in order: the "default" hue, a "lighter" hue, a "darker" hue, and a "text" hue.
        You can see all the default palettes into the file `node_modules/@angular/material/core/theming/_palette.scss`

   3. Define the typography configuration

        ```scss
        $default-typography-config: mat.define-typography-config();
        ```
        The `define-typography-config` SASS function define a typography configuration but, since its parameters are optional, 
        using it without parameters define the default Angular Material typography configuration. In the next section we'll se how to define a custom configuration.

   4. Define the dark and light variants

        ```scss
        $theme-light: mat.define-light-theme((
            color: (
                primary: $_purple-primary,
                accent: $_teal-accent,
                warn: $_orange-warn
            ),
            typography: $default-typography-config
        ));

        $theme-dark: mat.define-dark-theme((
            color: (
                primary: $_purple-primary,
                accent: $_teal-accent,
                warn: $_orange-warn
            ),
            typography: $default-typography-config
        ));
        ```
        With the `mat.define-light-theme` function we have defined a light theme, passing it the color and the typography values we have chosen before.

        It adds to the 'color' map two other maps: `foreground` for the color to use for the foreground (i.e. for the text) that, in this case, for a light theme, is black, and 
        `background` for the color to use for the backgrounds, that in this case, for a light theme, is white.  
        You can se all the keys defined into these maps at the end fo the file `node_modules/@angular/material/core/theming/_palette.scss`.

   5. Create the theme selector rule
   
        This selector set the theme for the Material components and for all the components of the app, by including their color mixins. You shouldn't have to change its content, but only choose the sector name: this is the class that you will have to add to the body element to set this theme.

        ```scss
        //Note the use of the -color mixin instead of the -theme mixin: this is because here we want set only the theme's colors.
        .new-theme {
            // Emit theme-dependent styles for common features used across multiple components.
            @include mat.core-color($theme-light);
            // Emit theme-dependent styles for all Angular Material components
            @include mat.all-component-colors($theme-light);
            // Emit theme-dependent styles for all custom components
            @include app.color($theme-light);

            &.dark {
                @include mat.core-color($theme-dark);
                @include mat.all-component-colors($theme-dark);
                @include app.color($theme-dark);
            }
        }
        ```
    
    6. The complete file should be something like this
    
        ```scss
        // src/styles/themes/_new-theme.scss

        @use "sass:map";
        @use '@angular/material' as mat;
        @use "../../app-theme" as app;

        $default-typography-config: mat.define-typography-config();

        $_purple-primary: mat.define-palette(mat.$purple-palette, 600, 400, 900);
        $_teal-accent: mat.define-palette(mat.$teal-palette, A700, 700, A400);
        $_orange-warn: mat.define-palette(mat.$orange-palette, 900, 700, A400);

        $theme-light: mat.define-light-theme((
            color: (
                primary: $_purple-primary,
                accent: $_teal-accent,
                warn: $_orange-warn
            ),
            typography: $default-typography-config
        ));

        $theme-dark: mat.define-dark-theme((
            color: (
                primary: $_purple-primary,
                accent: $_teal-accent,
                warn: $_orange-warn
            ),
            typography: $default-typography-config
        ));

        // This selector set the theme for the angular material components and for the components of the app, by including
        // their color mixins. Note the use of the -color mixin instead of the -theme mixin: this is because here we want set only
        // the theme's colors.
        .new-theme {
            // Emit theme-dependent styles for common features used across multiple components.
            @include mat.core-color($theme-light);
            // Emit theme-dependent styles for all Angular Material components
            @include mat.all-component-colors($theme-light);
            // Emit theme-dependent styles for all custom components
            @include app.color($theme-light);

            &.dark {
                @include mat.core-color($theme-dark);
                @include mat.all-component-colors($theme-dark);
                @include app.color($theme-dark);
            }
        }
        ```
   
2. Lazy load the new theme

    For our application, `new-theme` is an additional theme and can be loaded based on user preferences. So, instead of making it part of the default application, we will lazy load it.
    Add a new entry into the `styles` part of the `angular.json` file

    ```json
   "styles": [
      "src/styles.scss",
      {
        "input": "src/styles/themes/_new-theme.scss",
        "bundleName": "new-theme-bundle", // this is the file name of the css that the build process will create
        "inject": false // setting this false will not include the file from "input" path into the bundle
      }
    ],
   ```

3. Add the theme to the `StyleManager` service

    To make the theme publicly available across the entire app, we have to define it into the `StyleManager` service. 
    Add a new entry on the `themes` variable of the file `src/app/providers/style-manager.service.ts`

    ```js
    themes = [
        // ... other themes definitions,
        {
            // Displayed name
            displayName: "New Theme",
            // the class that needs to be set to activate the theme (the same used as selector into its .scss file)
            className: "new-theme",
            // css bundle file name AS IT WAS SET INTO THE angular.json FILE AND WITHOUT THE EXTENSION!
            bundleName: "new-theme-bundle",
            // set this to true only for the default theme
            isDefault: false,
        }
    ```

4. Add the theme to the `StyleSelectComponent` `themes` scss map.
   
    Since the themes are lazy loaded, the `StyleSelectComponent` cannot automatically set a different theme for each option, unless all theme files are loaded (because it needs to load the configuration of each theme).
    So, it is necessary to manually add a copy of the theme configuration to the `StyleSelectComponent` -theme.scss file.

    Add a new entry on the map `themes` of the scss file `src/app/components/style-select/_style-select.component-theme.scss`:

    ```scss
    // src/app/components/style-select/_style-select.component-theme.scss

    $themes: (
        ...,
        "new-theme": ( // <-- the map key MUST be aligned with the theme css selector defined in the src/styles/themes/_new-theme.scss file
            "primary": mat.define-palette(mat.$purple-palette, 600, 400, 900), // this color MUST be aligned with the primary color defined in the src/styles/themes/_new-theme.scss file
            "accent":  mat.define-palette(mat.$teal-palette, A700, 700, A400) // this color MUST be aligned with the accent color defined in the src/styles/themes/_new-theme.scss file
        )
    );
    ```

    Since the two configuration files must be always aligned, to simplify this alignment, all the palettes of each theme can be defined in a `src/styles/_variables.scss` file and used in both files. This app doesn't follow (for now) this approach, but an implementation could be roughly like this:

    ```scss
    // src/styles/_variables.scss

    // ...others palettes from other themes

    $purple-palette: mat.define-palette(mat.$purple-palette, 600, 400, 900);
    $teal-palette:mat.define-palette(mat.$teal-palette, A700, 700, A400);
    $orange-palette: mat.define-palette(mat.$orange-palette, 900, 700, A400);
    ```

    ```scss
        // src/styles/themes/_new-theme.scss

        @use "sass:map";
        @use '@angular/material' as mat;
        @use "../../app-theme" as app;
        @use "../variables.scss" as vars;

        $default-typography-config: mat.define-typography-config();

        $_purple-primary: vars.$purple-palette;
        $_teal-accent: vars.$teal-palette;
        $_orange-warn: var.$orange-palette;

        // ... rest of the file will be unchanged
    ```

    ```scss
    // src/app/components/style-select/_style-select.component-theme.scss

    @use "../_variables.scss" as vars

    $themes: (
        ...,
        "new-theme": ( // <-- the map key MUST be aligned with the theme css selector defined in the src/styles/themes/_new-theme.scss file
            "primary": vars.$purple-palette
            "accent":  vars.$teal-palette
        )
    );
    ```

5. That's it! Now the new theme should be present into the themes selection component and should be automatically set if chosen. 

### Create a custom typography
The flow to create a custom typography are roughly the same to create a custom theme, with some changes.


1. Add stylesheets to the `index.html` page
    If the new typography requires some additional stylesheets (i.e. a new font), manually add them to the head section of the  `index.html` file

        ```html
        <!-- src/index.html -->
        <head>
            <!-- ... other head items -->
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500&display=swap">
        </head>
        ```
2. Create a SCSS file into the folder `src/typography/themes`, follow the name convention of the other files present in this folder. Into this new file:
   1. Adds the imports
       
        ```scss
        // src/styles/typography/_typography-new.scss

        @use "sass:map";
        @use '@angular/material' as mat;
        @use "../../app-theme" as app;

        ```

   2. Define the typography configuration
        For example, here we set only a new font family to _Work Sans_:

        ```scss
        $work-sans: "'Work Sans', sans-serif";

        $typography-config: mat.define-typography-config(
            $font-family: $work-sans 
        );
        ```
        Remember that the `define-typography-config` SASS function defines a typography configuration but, since its parameters are optional, 
        for each parameter not set, default Angular Material typography configuration will be used.

        In this other example, we define also the configuration for some preconfigured levels:

        ```scss
        $typography-config: mat.define-typography-config(
            $display-4: mat.define-typography-level(112px, $font-family: $work-sans),
            $display-3: mat.define-typography-level(56px, $font-family: $work-sans),
            $display-2: mat.define-typography-level(45px, $font-family: $work-sans),
            $display-1: mat.define-typography-level(34px, $font-family: $work-sans),
            $headline: mat.define-typography-level(24px, $font-family: $work-sans),
            $title: mat.define-typography-level(20px, $font-family: $work-sans),
        );
        ```
   
   3. Create the typography selector rule
   
        This selector set the typography for the Material components and for all the components of the app, by including their typography mixins. You shouldn't have to change its content, but only choose the sector name: this is the class that you will have to add to the body element to set this theme.

        ```scss
        //Note the use of the -color mixin instead of the -theme mixin: this is because here we want set only the theme's colors.
        .typography-new {
            // Emit theme-dependent styles for all Angular Material components
            @include mat.all-component-typographies($typography-config);
            // Emit theme-dependent styles for all custom components
            @include app.typography($typography-config);
        }
        ```
    
    4. The complete file should be something like this
    
        ```scss
        // src/styles/typography/_typography-new.scss
        
        @use "sass:map";
        @use '@angular/material' as mat;
        @use "../../app-theme" as app;

        $work-sans: "'Work Sans', sans-serif";

        $typography-config: mat.define-typography-config(
            $font-family: $work-sans
        );


        .typography-new {
            // Emit theme-dependent styles for all Angular Material components
            @include mat.all-component-typographies($typography-config);
            // Emit theme-dependent styles for all custom components
            @include app.typography($typography-config);
        }
        ``` 
3. Lazy load the new typography

    For our application, `new-typography` is an additional typography and can be loaded based on user preferences. So, instead of making it part of the default application, we will lazy load it.
    Add a new entry into the `styles` part of the `angular.json` file

    ```json
   "styles": [
      "src/styles.scss",
      ...
      {
        "input": "src/styles/typography/_typography-new.scss",
        "bundleName": "new-typography-bundle", // this is the file name of the css that the build process will create
        "inject": false // setting this false will not include the file from "input" path into the bundle
      }
    ],
   ```
4. Add the typography to the `StyleManager` service

    To make the typography publicly available across the entire app, we have to define it into the `StyleManager` service. 
    Add a new entry on the `topographies` variable of the file `src/app/providers/style-manager.service.ts`

    ```js
    topographies = [
        // ... other topographies definitions,
        {
            // Displayed name
            displayName: "New Typography",
            // the class that needs to be set to activate the theme (the same used as selector into its .scss file)
            className: "new-typography",
            // css bundle file name AS IT WAS SET INTO THE angular.json FILE AND WITHOUT THE EXTENSION!
            bundleName: "new-typography-bundle",
            // set this to true only for the default theme
            isDefault: false,
        }
    ```

5. Add the typography to the `StyleSelectComponent` `typographies` scss map.
   
    Since the typographies are lazy loaded, the `StyleSelectComponent` cannot automatically set a different typography for each option, unless all typographies files are loaded (because it needs to load the configuration of each typography).
    So, it is necessary to manually add a copy of the typography configuration to the `StyleSelectComponent` -theme.scss file.

    Add a new entry on the map `typographies` of the scss file `src/app/components/style-select/_style-select.component-theme.scss`:

    ```scss
    // src/app/components/style-select/_style-select.component-theme.scss

    $typographies: (
        ...,
        // the map key MUST be aligned with the typography css selector defined in the src/styles/typography/_typography-new.scss
        // this typography config MUST be aligned with the config defined in the src/styles/typography/_typography-new.scss file
        "new-typography": mat.define-typography-config(
            $font-family: "'Work Sans', sans-serif";
        );
    );
    ```

    Since the two configuration files must be always aligned, to simplify this alignment, all the typography configs of each theme can be defined in a `src/styles/_variables.scss` file and used in both files. This app doesn't follow (for now) this approach, but an implementation could be roughly like this:

    ```scss
    // src/styles/_variables.scss

    // ...others palettes from other themes

    $work-sans-typography: mat.define-typography-config(
            $font-family: "'Work Sans', sans-serif";
    );
    ```

    ```scss
        // src/styles/typography/_typography-new.scss
        
        @use "sass:map";
        @use '@angular/material' as mat;
        @use "../../app-theme" as app;
        @use "../variables.scss" as vars;

        $typography-config: vars.$work-sans-typography;

        // ... rest of the file will be unchanged
    ```

    ```scss
    // src/app/components/style-select/_style-select.component-theme.scss

    @use "../_variables.scss" as vars

    $typographies: (
        ...,
        // the map key MUST be aligned with the typography css selector defined in the src/styles/typography/_typography-new.scss
        "new-typography": vars.$work-sans-typography;
    );
    ```

6. That's it! Now the new typography should be present into the topographies selection component and should be automatically set if chosen. 

#### Per-theme typography
You can also set a typography configuration into a theme. In this way that configuration will be unique for the theme and will be applied along with it.

To set a per-theme typography, into the theme [definition](#create-a-theme) change the default typography configuration (step 1.3.), with your custom configuration.

```scss
// src/styles/themes/_new-theme.scss

// change this...
$default-typography-config: mat.define-typography-config();

// ...with your custom configuration
$work-sans: "'Work Sans', sans-serif";

$typography-config: mat.define-typography-config(
    $font-family: $work-sans 
);
```

Then, when you define the css selector for the theme (step 1.5.) you have to add to the components emitted color mixins also their typography mixins.

The selector becomes from this

```scss
.new-theme {
    // Emit theme-dependent styles for common features used across multiple components.
    @include mat.core-color($theme-light);
    // Emit theme-dependent styles for all Angular Material components
    @include mat.all-component-colors($theme-light);
    // Emit theme-dependent styles for all custom components
    @include app.color($theme-light);

    &.dark {
        @include mat.core-color($theme-dark);
        @include mat.all-component-colors($theme-dark);
        @include app.color($theme-dark);
    }
}
```

to this

```scss
.new-theme {
    // Emit theme-dependent styles for common features used across multiple components.
    @include mat.core-color($theme-light);
    // Emit theme-dependent styles for all Angular Material components
    @include mat.all-component-colors($theme-light);
    @include mat.all-component-typographies($typography-config);
    // Emit theme-dependent styles for all custom components
    @include app.color($theme-light);
    @include app.typography($typography-config);
    
    &.dark {
        // Emit theme-dependent styles for common features used across multiple components.
        @include mat.core-color($theme-dark);
        // Emit theme-dependent styles for all Angular Material components
        @include mat.all-component-colors($theme-dark);
        @include mat.all-component-typographies($typography-config);
        // Emit theme-dependent styles for all custom components
        @include app.color($theme-dark);
        @include app.typography($typography-config);
    }
}
```

**NOTE**: remember that in css the order in which rules are applied matters, so if you want that the theme typography to override the global typography, make sure   that the theme is applied _after_ the typography was applied._
