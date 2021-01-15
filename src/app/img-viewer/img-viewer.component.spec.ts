import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageViewer } from 'iv-viewer';
import { ImgViewerComponent } from './img-viewer.component';

describe('ImgViewerComponent', () => {
  let component: ImgViewerComponent;
  let fixture: ComponentFixture<ImgViewerComponent>;
  let imgTotal = 0;
  let zoomValue = 10;
  let spy: any;
  let mockImageViewer: any = null;
  let images = ['assets/bg1.jpg', 'assets/bg2.jpg'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImgViewerComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [],
      imports: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgViewerComponent);
    component = fixture.componentInstance;
  });

  describe('initImgViewer() to be executed', () => {
    it('should set pageLoaded after view init', () => {
      fixture.detectChanges();
      expect(component.imageViewer$).toBeInstanceOf(ImageViewer);
    });
  });

  describe('loadImages', () => {
    it('Load First Image', () => {
      fixture.detectChanges();
      component.images = images;
      spy = spyOn(component.imageViewer$, 'load');
      component.showImg();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Next Image', () => {
    it('Load Next Image', () => {
      fixture.detectChanges();
      component.images = images;
      spy = spyOn(component.imageViewer$, 'load');
      component.nextImg();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Previous Image', () => {
    it('Load Prev Image', () => {
      fixture.detectChanges();
      component.images = images;
      component.currentImgIndex = 2;
      spy = spyOn(component.imageViewer$, 'load');
      component.prevImg();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('zoomInImg', () => {
    it('Zoom out', () => {
      component.zoomValue = 50;
      fixture.detectChanges();
      spy = spyOn(component.imageViewer$, 'zoom');
      component.zoomInImg();
      expect(spy).toHaveBeenCalled();
    });
    it('Zoom out with 100', () => {
      fixture.detectChanges();
      component.zoomValue = 100;
      spy = spyOn(component.imageViewer$, 'zoom');
      component.zoomInImg();
      expect(spy).toHaveBeenCalled();
    });
    it('Zoom out with value -10', () => {
      fixture.detectChanges();
      component.zoomValue = -10;
      spy = spyOn(component.imageViewer$, 'zoom');
      component.zoomInImg();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('zoomOutImg', () => {
    it('test 2', () => {
      component.zoomValue = 60;
      fixture.detectChanges();
      spy = spyOn(component.imageViewer$, 'zoom');
      component.zoomOutImg();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('rotateImg', () => {
    it('rotateImg clockWise', () => {
      component.zoomValue = 60;
      fixture.detectChanges();
      spy = spyOn(component, 'rotateImg');
      component.rotateImg(true);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Download Image', () => {
    it('Download Image', () => {
      component.zoomValue = 60;
      fixture.detectChanges();
      spy = spyOn(component, 'downloadImg');
      component.downloadImg();
      expect(spy).toHaveBeenCalled();
    });
  });
});
