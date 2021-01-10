import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Renderer2,
} from '@angular/core';
import { FullScreenViewer, ImageViewer } from 'iv-viewer';
import { ImgViewerConfig } from './img-viewer.config';
import { ImgViewerType } from './interfaces/img-viewer.type';
import { IvViewerType } from './interfaces/iv-viewer.type';

@Component({
  selector: 'ngx-image-viewer',
  templateUrl: './img-viewer.component.html',
  styleUrls: ['./img-viewer.component.scss'],
})
export class ImgViewerComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() imgViewerClass: string = '';
  @Input() images: string[] = [];
  @Input() showOperate = true;
  @Input() zoom = true;
  @Input() rotate = true;
  @Input() reset = true;
  @Input() fullscreen = true;
  @Input() download = true;
  @Input() defaultName = 'download';
  @Output() prevChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() nextChange: EventEmitter<number> = new EventEmitter<number>();
  ROTATE_ANGLE = 90;
  imageViewer$: any;
  fullScreenViewer$: any;
  element: HTMLElement;
  currentImgIndex = 1;
  imgTotal = 0;
  zoomValue = 100;
  isVertical = false;
  imgRotate = 0;
  imgViewerConfig: ImgViewerConfig | undefined;
  ivViewerType: IvViewerType | undefined;
  imageViewerType: ImgViewerType | undefined;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private doc: Document,
    @Optional() private config: ImgViewerConfig
  ) {
    this.element = this.el.nativeElement as HTMLElement;
    this.imgViewerConfig = new ImgViewerConfig();
    this.ivViewerType = this.imgViewerConfig.ivViewerType;
    this.imageViewerType = this.imgViewerConfig.imageViewerType;
    if (this.config && this.config.ivViewerType) {
      this.ivViewerType = Object.assign(
        this.ivViewerType,
        this.config.ivViewerType
      );
    }
    if (this.config && this.config.imageViewerType) {
      this.imageViewerType = Object.assign(
        this.imageViewerType,
        this.config.imageViewerType
      );
    }
  }

  ngOnInit(): void {
    this.imgTotal = this.images.length;
  }

  ngAfterViewInit(): void {
    this.initImgViewer();
  }

  zoomInImg(): void {
    this.zoomValue += 10;
    this.imageViewer$.zoom(this.zoomValue);
  }

  zoomOutImg(): void {
    if (this.zoomValue === 100) {
      return;
    }
    this.zoomValue -= 10;
    if (this.zoomValue < 0) {
      this.zoomValue = 0;
    }
    this.imageViewer$.zoom(this.zoomValue);
  }

  rotateImg(isClockwise: boolean): void {
    this.beforeRotateImg().then((time: number) => {
      if (isClockwise) {
        this.imgRotate += this.ROTATE_ANGLE;
      } else {
        this.imgRotate -= this.ROTATE_ANGLE;
      }
      this.isVertical = !this.isVertical;
      time <= 0
        ? this.addImgRotate()
        : setTimeout(() => this.addImgRotate(), time);
    });
  }

  fullscreenImg(): void {
    this.beforeRotateImg().then((time: number) => {
      if (time <= 0) {
        this.fullScreenViewer$.show(this.images[this.currentImgIndex - 1]);
        this.addImgRotate(false);
      } else {
        setTimeout(() => {
          this.fullScreenViewer$.show(this.images[this.currentImgIndex - 1]);
          this.addImgRotate(false);
        }, time);
      }
    });
  }

  downloadImg(): void {
    const download = this.renderer.createElement('a');
    this.renderer.setAttribute(
      download,
      'download',
      `${this.defaultName}-${this.currentImgIndex}`
    );
    this.renderer.setAttribute(download, 'display', 'none');
    this.renderer.setAttribute(
      download,
      'href',
      this.images[this.currentImgIndex - 1]
    );
    this.renderer.setAttribute(download, 'target', '_blank');
    this.renderer.appendChild(this.element, download);
    download.click();
    this.renderer.removeChild(this.element, download);
  }

  prevImg(): void {
    this.isVertical = false;
    this.currentImgIndex--;
    if (this.currentImgIndex <= 0) {
      this.currentImgIndex = this.imgTotal;
    }
    this.showImg();
    this.prevChange.emit(this.currentImgIndex);
  }

  nextImg(): void {
    this.isVertical = false;
    this.currentImgIndex++;
    if (this.currentImgIndex > this.imgTotal) {
      this.currentImgIndex = 1;
    }
    this.showImg();
    this.nextChange.emit(this.currentImgIndex);
  }

  private initImgViewer(): void {
    this.imageViewer$ = new ImageViewer(
      this.element.querySelector('.img-viewer-panel-body-content'),
      this.ivViewerType
    );
    this.fullScreenViewer$ = new FullScreenViewer(this.ivViewerType);
    this.showImg();
  }

  private addImgRotate(isAnimation = true): void {
    let scale = '';
    if (this.isVertical && this.isImgOverVertical()) {
      scale = `scale(${this.getScale()})`;
    }
    const rotate = `rotate(${this.imgRotate}deg)`;
    if (isAnimation) {
      this.addTransition('iv-snap-image');
      this.addTransition('iv-small-image');
    }
    this.setImgRotate('iv-snap-image', rotate, scale);
    this.setImgRotate('iv-small-image', rotate, scale);
    setTimeout(() => {
      if (isAnimation) {
        this.removeAnimation('iv-snap-image');
        this.removeAnimation('iv-small-image');
      }
    }, 500);
  }

  private async beforeRotateImg(): Promise<any> {
    this.zoomValue = 100;
    const time: number = this.imageViewer$._state.zoomValue - this.zoomValue;
    await this.imageViewer$.resetZoom();
    await this.imageViewer$.refresh();
    return time === 0 ? 0 : 500;
  }

  showImg(): void {
    this.imgRotate = 0;
    this.isVertical = false;
    this.imageViewer$.load(this.images[this.currentImgIndex - 1]);
  }

  private isImgOverVertical(): boolean {
    const imgViewerHeight = this.element.clientHeight;
    let currentImgWidth = 0;
    var element = this.element.querySelector('.iv-small-image');
    if (element != null) {
      currentImgWidth = element.clientWidth;
    }
    return imgViewerHeight < currentImgWidth + 10;
  }

  private getScale(): number {
    let imgViewerHeight = 0;
    var element = this.element.querySelector('.img-viewer-panel-body-content');
    if (element != null) {
      imgViewerHeight = element.clientHeight;
    }

    let currentImgWidth = 0;
    element = this.element.querySelector('.iv-small-image');
    if (element != null) {
      currentImgWidth = element.clientWidth;
    }

    const differenceWidth = currentImgWidth - imgViewerHeight;
    if (differenceWidth >= 250 && differenceWidth < 300) {
      return differenceWidth / imgViewerHeight - 0.1;
    } else if (differenceWidth >= 300 && differenceWidth < 400) {
      return differenceWidth / imgViewerHeight - 0.15;
    } else if (differenceWidth >= 400) {
      return differenceWidth / imgViewerHeight - 0.32;
    } else if (differenceWidth < 0) {
      return 1;
    }
    return 0.6;
  }

  private addTransition(node: any): void {
    this.setStyle(node, 'transition', '0.5s linear');
  }

  private removeAnimation(node: any): void {
    this.setStyle(node, 'transition', 'auto');
  }

  private setImgRotate(node: any, rotate: any, scale: any): void {
    this.setStyle(node, 'transform', `${rotate} ${scale}`);
  }

  private setStyle(node: any, name: any, value: any): void {
    const elements = this.doc.querySelectorAll(`.${node}`);
    elements.forEach((ele) => this.renderer.setStyle(ele, name, value));
  }

  ngOnDestroy(): void {
    if (!!this.imageViewer$) {
      this.imageViewer$ = this.imageViewer$.destroy();
    }
    if (!!this.fullScreenViewer$) {
      this.fullScreenViewer$ = this.fullScreenViewer$.destroy();
    }
  }
}
