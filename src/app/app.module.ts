import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ThreeSceneComponent } from './three-scene/three-scene.component';
import { EditorPaneComponent } from './editor-pane/editor-pane.component';

@NgModule({
  declarations: [
    AppComponent,
    ThreeSceneComponent,
    EditorPaneComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
