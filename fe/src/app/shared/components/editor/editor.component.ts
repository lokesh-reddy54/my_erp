import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from "@angular/core";
import { forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Helpers } from 'src/app/helpers';

declare var $: any;
declare var FroalaEditor: any;

@Component({
  selector: 'editor',
  template: `<div id="htmleditor"></div>`,
  // templateUrl: 'editor.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EditorComponent),
    multi: true
  }]
})
export class EditorComponent implements OnInit, AfterViewInit {

  public id: string;
  private editorInitiated: any = false;

  // Inputs
  @Input() value: any;
  @Input() ngModel: any;

  @Input() public placeholder: any;
  @Input() public options: any;

  @Output() onUpdated = new EventEmitter();

  constructor() {
    
  }

  isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);
  showEditor: any = false;
  user: any = JSON.parse(localStorage.getItem('currentUser'));
  ngOnInit(): void {
    console.log("editor ::: onInit : !!!");
   }

  ngAfterViewInit() {
    console.log("editor ::: ngAfterViewInit : !!! ");
     var imageUploadURL = Helpers.composeEnvUrl() + 'upload';
    var options = {
      placeholderText: 'Your mail content here',
      charCounterCount: false,
      quickInsertEnabled: false,
      toolbarButtons: {
        moreText: {
          buttons: ['bold', 'italic', 'underline', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'strikeThrough', 'subscript', 'superscript', 'inlineClass', 'inlineStyle', 'clearFormatting'],
          align: 'left',
          buttonsVisible: 7
        },
        moreParagraph: {
          buttons: ['alignLeft', 'alignCenter','alignRight', 'formatOL', 'formatUL', 'outdent', 'indent', 'lineHeight',  'alignJustify', 'paragraphFormat', 'paragraphStyle', 'quote'],
          align: 'left',
          buttonsVisible: 7
        },
        moreRich: {
          buttons: ['insertLink', 'insertImage','embedly', 'insertHR'],
          align: 'left',
          buttonsVisible: 4
        },
        // moreRich: {
        //   buttons: ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertFile', 'insertHR'],
        //   align: 'left',
        //   buttonsVisible: 3
        // },
        moreMisc: {
          buttons: ['undo', 'redo',  'spellChecker', 'selectAll',  'help'],
          align: 'right',
          buttonsVisible: 2
        }
      },
      imageUploadURL: imageUploadURL,
      imageUploadMethod: 'POST',
      imageMaxSize: 15 * 1024 * 1024,
      imageAllowedTypes: ['jpeg', 'jpg', 'png'],
    }
    var editor = new FroalaEditor('#htmleditor', options);
  }

  updateValue(value) {
    this.onUpdated.emit(value);
  }

  writeValue(value: any) {
    console.log("EditorComponent ::: writeValue :: ", value)
  }

  propagateChange = (_: any) => { };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }


}
