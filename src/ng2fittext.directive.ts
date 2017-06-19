import {Directive, ElementRef, Renderer, Input, AfterViewInit, HostListener, OnInit} from '@angular/core';

@Directive({
  selector: '[fittext]'
})
export class FittextDirective implements AfterViewInit, OnInit {

  @Input('fittext') fittext: any;
  @Input('activateOnResize') activateOnResize: boolean;
  @Input('activateOnInputEvents') activateOnInputEvents: boolean;
  @Input('useMaxFontSize') useMaxFontSize: boolean;
  private maxFontSize: number = 1000;
  private fontSize: number = 0;
  private speed: number = 1.05;

  constructor(public el: ElementRef, public renderer: Renderer) {
  }

  setFontSize(fontSize) {
    console.log();

    this.fontSize = fontSize;
    return this.el.nativeElement.style.setProperty('font-size', (fontSize).toString() + 'px');
  }

  calculateFontSize(fontSize, speed) {
    // TODO Do with Gauss
    return Math.floor(fontSize / speed);
  }

  checkOverflow(children: any) {
    const parent = children.parentElement;

    let overflowX = children.scrollWidth - parent.clientWidth;
    let overflowY = children.clientHeight - parent.clientHeight;
    return (overflowX > 1 || overflowY > 1);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.activateOnResize && this.fittext) {
      if (this.activateOnInputEvents && this.fittext) {
          this.setFontSize(this.el.nativeElement.parentElement.clientHeight);
      } else {
        this.setFontSize(this.el.nativeElement.parentElement.clientWidth);
      }
      this.ngAfterViewInit();
    }
  }

  @HostListener('input', ['$event'])
  onInputEvents() {
    if (this.activateOnInputEvents && this.fittext) {
        this.setFontSize(this.el.nativeElement.parentElement.clientHeight);
        this.ngAfterViewInit();
    }
  }

  ngOnInit() {
    if (this.useMaxFontSize) {
      this.maxFontSize = parseInt(window.getComputedStyle(this.el.nativeElement).fontSize, null);
    }

    if (this.fittext) {
      this.setFontSize(this.maxFontSize);
    }
    this.el.nativeElement.style.setProperty('will-change', 'content');
  }

  ngAfterViewInit() {
    if (this.fittext) {
      let overflow = this.checkOverflow(this.el.nativeElement);
      if (overflow) {
        this.setFontSize(this.calculateFontSize(this.fontSize, this.speed));
        this.ngAfterViewInit();
      }
    }
  }
}