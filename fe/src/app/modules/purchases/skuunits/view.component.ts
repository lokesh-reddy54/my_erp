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
  selector: 'purchases-skuunits',
  templateUrl: './view.component.html'
})
export class PurchasesSkuUnitsComponent implements OnInit {
  unitForm: FormGroup;

  selectedCategory: any;
  selectedType: any;
  category: any = {};
  type: any = {};
  sku: any = {};
  roles: any = ['Asset', 'Material', 'Service'];
  categoryConfig: any = {};
  typeConfig: any = {};
  skuConfig: any = {};

  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  categoryFilters: any = {};
  typeFilters: any = {};
  skuFilters: any = {};


  constructor(private dialogs: DialogsService, private service: PurchasesService) { }

  ngOnInit() {
    this.unitForm = new FormGroup({
      name: new FormControl("", Validators.required),
      symbol: new FormControl("", Validators.required),
    });

    this.listAllUnits();
  }


  skuUnits: any = [];
  listAllUnits() {
    this.service.listSkuUnits({}).pipe(take(1))
      .subscribe(res => {
        this.skuUnits = res['data'];
      })
  }

  skuUnit: any = {};
  saveSkuUnit() {
    console.log("SkusComponent ::: save :: skuUnit ", this.skuUnit);
    this.loading = true;
    let self = this;
    this.service.saveSkuUnit(this.skuUnit).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Sku Unit '" + this.skuUnit.name + "' is saved successfully ");
        this.listAllUnits();
        this.loading = false;
        this.skuUnit = {};
        this.unitForm.reset();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  deleteSkuUnit(unit) {
    console.log("SkusComponent ::: deleteSkuUnit :: skuUnit ", unit);
    this.loading = true;
    let self = this;
    this.service.deleteSkuUnit(unit.id).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Sku Unit '" + unit.name + "' is deleted successfully ");
        this.listAllUnits();
        this.loading = false;
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

}
