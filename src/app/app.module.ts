import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ImgViewerModule } from './img-viewer/img-viewer.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ImgViewerModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
