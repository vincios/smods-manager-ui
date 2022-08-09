import {Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, Optional, Self} from '@angular/core';
import {StyleDefinition} from "../../providers/style-manager.service";
import {ControlValueAccessor, FormBuilder, FormControl, NgControl} from "@angular/forms";
import {MatFormFieldControl} from "@angular/material/form-field";
import {Subject, Subscription} from "rxjs";
import {FocusMonitor} from "@angular/cdk/a11y";
import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'app-style-select',
    templateUrl: './style-select.component.html',
    styleUrls: ['./style-select.component.scss'],
    providers: [{provide: MatFormFieldControl, useExisting: StyleSelectComponent}]
})
export class StyleSelectComponent implements MatFormFieldControl<string>, ControlValueAccessor, OnInit, OnDestroy {

    static nextId = 0;

    private _placeholder: string = "";
    private _disabled = false;
    private _required: boolean = false;

    private _controlValueChangeSubscription: Subscription | undefined;

    _selectedStyle: StyleDefinition | undefined;

    stateChanges = new Subject<void>();

    control: FormControl<string | null>;
    focused = false;

    controlType = 'style-select';

    @HostBinding() id = `example-tel-input-${StyleSelectComponent.nextId++}`;

    @Input('styles') choices: StyleDefinition[] = [];
    @Input('aria-describedby') userAriaDescribedBy: string = "";

    @Input()
    get value(): string | null {
        return this.control.value;
    }
    set value(value: string | null) {
        this.control.setValue(value);
        this.stateChanges.next();
        if (this._onChange) this._onChange(value);
        this._selectedStyle = this.choices.find(style => style.className === value);
    }

    @Input()
    get placeholder(): string {
        return this._placeholder;
    }
    set placeholder(placeholder: string) {
        this._placeholder = placeholder;
        this.stateChanges.next();
    }

    @Input()
    get required(): boolean {
        return this._required
    }
    set required(req: boolean) {
        this._required = coerceBooleanProperty(req);
        this.stateChanges.next();
    }

    @Input()
    get disabled(): boolean {
        return this._disabled;
    }
    set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);
        this._disabled ? this.control.disable() : this.control.enable();
        this.stateChanges.next();
    }

    get empty(): boolean {
        return !this.control.value;
    }

    get errorState(): boolean {
        return (this.ngControl.errors !== null || this.control.errors !== null);
    }

    @HostBinding('class.floating')
    get shouldLabelFloat(): boolean {
        return this.focused || !this.empty;
    }

    @HostBinding('attr.aria-describedby') describedBy = '';
    setDescribedByIds(ids: string[]) {
        this.describedBy = ids.join(' ');
    }

    onContainerClick(event: MouseEvent) {
        if(!this.disabled && this._onTouched) {
            this._onTouched();
        }
    }


    constructor(
        @Optional() @Self() public ngControl: NgControl,
        fb: FormBuilder,
        private fm: FocusMonitor,
        private elRef: ElementRef<HTMLElement>,
        private iconRegistry: MatIconRegistry,
        sanitizer: DomSanitizer
    ) {
        this.control = fb.control('');
        if (this.ngControl != null) {
            // Setting the value accessor directly (instead of using
            // the providers) to avoid running into a circular import.
            this.ngControl.valueAccessor = this;
        }

        fm.monitor(elRef, true).subscribe(origin => {
            this.focused = !this.disabled && !!origin;
            this.stateChanges.next();
        });

        iconRegistry.addSvgIcon('theme-example', sanitizer.bypassSecurityTrustResourceUrl('assets/img/theme-demo-box.svg'));
        iconRegistry.addSvgIcon('theme-example-circles', sanitizer.bypassSecurityTrustResourceUrl('assets/img/theme-demo-circles.svg'));
    }

    // ControlValueAccessor interface methods
    clearInput(): void {
        this.control.setValue('');
    }
    writeValue(obj: any): void {
        this.value = obj;
    }

    _onChange: ((_: any) => void) | undefined;
    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    _onTouched: (() => void) | undefined;
    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    private setDisabled() {
        if(this.disabled && this.control) {
            this.control.disable();
        } else if(this.control) {
            this.control.enable();
        }
    }

    ngOnInit(): void {
        this._controlValueChangeSubscription = this.control.valueChanges.subscribe((value) => {
            this._selectedStyle = this.choices.find(style => style.className === value);
            if (this._onChange) this._onChange(value);
            this.stateChanges.next();
        });
    }

    ngOnDestroy(): void {
        this.stateChanges.complete();
        this.fm.stopMonitoring(this.elRef.nativeElement);
        if (this._controlValueChangeSubscription) this._controlValueChangeSubscription.unsubscribe();
    }

}
