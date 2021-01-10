import { ImgViewerType } from './interfaces/img-viewer.type';
import { IvViewerType } from './interfaces/iv-viewer.type';

export class ImgViewerConfig {
  ivViewerType?: IvViewerType = {
    zoomValue: 100,
    maxZoom: 500,
    snapView: true,
    refreshOnResize: true,
    zoomOnMouseWheel: true,
  };
  imageViewerType?: ImgViewerType = {
    zoomInToolTip: 'Zoom-in',
    zoomOutToolTip: 'Zoom-out',
    rotateLeftToolTip: 'Rotate Left',
    rotateRightToolTip: 'Rotate Right',
    resetToolTip: 'Reset',
    fullScreenToolTip: 'Full Screen',
    downloadToolTip: 'Download',
  };
}
