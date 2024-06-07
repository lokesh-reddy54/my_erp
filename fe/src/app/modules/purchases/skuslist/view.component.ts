import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { PurchasesService } from 'src/app/shared/services/purchases.service';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';

@Component({
  selector: 'purchases-skuslist',
  templateUrl: './view.component.html'
})
export class PurchasesSkusListComponent implements OnInit {
  skuSearch: FormControl = new FormControl();

  skusConfig: any = {};
  @ViewChild('skusList') skusList: any;

  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  skusFilters: any = {active:1};

  constructor(private dialogs: DialogsService, private service: PurchasesService) { }

  ngOnInit() {
    this.skuSearch.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.skusFilters.search = value;
      });

    this.skusConfig = {
      columns: [
        { label: 'Category', field: 'category.name', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'Type', field: 'type.name', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'SKU', field: 'name', type: 'text', styleClass: 'w-40', sortable: true },
        { label: 'Kind', field: 'kind', type: 'text', styleClass: 'w-10' },
        { label: 'Asset', field: 'isAsset', type: 'boolean', styleClass: 'w-5' },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5' },
      ],
      actions: [
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td',
      }
    }
  }

}
