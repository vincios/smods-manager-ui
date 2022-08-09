import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import {  HttpClient, HttpClientModule } from '@angular/common/http';
import { PagesModule } from './pages/pages.module';
import { SharedModule } from './shared/shared.module';
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader, TranslateModule, TranslateStore } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// export class CustomTranslateLoader implements TranslateLoader {
//   getTranslation(lang: string): Observable<any> {
//     console.log("LOADING", lang, import(`../assets/i18n/${lang}.json`));

//     return from(import(`../assets/i18n/${lang}.json`));
//   }
// }

export class MyMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    console.log(params)
      return `Key not found ${params.key}`;
  }
}

@NgModule({
  declarations: [
    AppComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        CommonModule,
        MaterialModule,
        HttpClientModule,
        PagesModule,
        SharedModule,
        TranslateModule.forRoot({
            missingTranslationHandler: {provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler},
            useDefaultLang: true,
            // defaultLanguage: 'en',
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [HttpClient]
            }
        }),
    ],
  providers: [TranslateStore],
  bootstrap: [AppComponent]
})
export class AppModule { }
