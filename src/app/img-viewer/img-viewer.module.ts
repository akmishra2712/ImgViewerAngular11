import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AppModule } from '../app.module';
import { ImgViewerComponent } from './img-viewer.component';
import { ImgViewerConfig } from './img-viewer.config';

@NgModule({
  declarations: [ImgViewerComponent],
  imports: [CommonModule],
  exports: [ImgViewerComponent],
})
export class ImgViewerModule {
  static forRoot(config?: ImgViewerConfig): ModuleWithProviders<AppModule> {
    return {
      ngModule: ImgViewerModule,
      providers: [{ provide: ImgViewerConfig, useValue: config }],
    };
  }
}
