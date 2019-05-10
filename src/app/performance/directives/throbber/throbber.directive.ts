import {
  ComponentFactoryResolver,
  Directive,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewContainerRef,
  ViewRef,
  OnInit,
  ComponentRef,
  TemplateRef,
} from '@angular/core';
import { ThrobberComponent } from '../../components/throbber/throbber.component';

@Directive({
  selector: '[throbber]',
})
export class ThrobberDirective implements OnChanges, OnInit, OnDestroy {
  private _isLoading: boolean;
  @Input()
  set throbber(value: boolean) {
    this._isLoading = value;
  }

  private _cls: string;
  @Input()
  set throbberClass(value: string) {
    this._cls = value;
  }
  private _throbberComponentRef: ComponentRef<ThrobberComponent>;

  private readonly _throbberComponentViewRef: ViewRef;
  _finalViewRef: ViewRef;

  constructor(
    private _throbberCptFactoryResolver: ComponentFactoryResolver,
    injector: Injector,
    private _viewContainerRef: ViewContainerRef,
    private _templateRef: TemplateRef<any>
  ) {
    const throbberComponentFactory = _throbberCptFactoryResolver.resolveComponentFactory(
      ThrobberComponent
    );
    this._throbberComponentRef = throbberComponentFactory.create(injector);
    this._throbberComponentViewRef = this._throbberComponentRef.hostView;
    this._finalViewRef = this._viewContainerRef.createEmbeddedView(
      this._templateRef
    );
  }
  ngOnInit() {
    this._throbberComponentRef.instance.throbberClass = this._cls;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['throbber'] && !changes['throbber'].isFirstChange()) {
      if (this._isLoading) {
        this._viewContainerRef.detach(
          this._viewContainerRef.indexOf(this._finalViewRef)
        );
        this._viewContainerRef.insert(this._throbberComponentViewRef); // insert the view in the last position
      } else {
        this._viewContainerRef.detach(
          this._viewContainerRef.indexOf(this._throbberComponentViewRef)
        );
        this._viewContainerRef.insert(this._finalViewRef);
      }
    }
  }

  ngOnDestroy(): void {
    this._throbberComponentViewRef.destroy(); // destroy the spinner
  }
}
