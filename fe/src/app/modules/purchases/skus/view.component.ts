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
  selector: 'purchases-skus',
  templateUrl: './view.component.html'
})
export class PurchasesSkusComponent implements OnInit {
  typeSearch: FormControl = new FormControl();
  skuSearch: FormControl = new FormControl();
  form: FormGroup;
  categoryForm: FormGroup;
  skuForm: FormGroup;
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
  @ViewChild('categoryModal') categoryModal: any;
  @ViewChild('typeModal') typeModal: any;
  @ViewChild('skuModal') skuModal: any;
  @ViewChild('skuUnitModal') skuUnitModal: any;
  @ViewChild('categoryList') categoryList: any;
  @ViewChild('typeList') typeList: any;
  @ViewChild('skuList') skuList: any;

  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  categoryFilters: any = {};
  typeFilters: any = {};
  skuFilters: any = {};

  skusObservable: Observable<any[]>;

  constructor(private dialogs: DialogsService, private service: PurchasesService) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl("", Validators.required),
    });
    this.categoryForm = new FormGroup({
      name: new FormControl("", Validators.required),
    });
    this.unitForm = new FormGroup({
      name: new FormControl("", Validators.required),
      symbol: new FormControl("", Validators.required),
    });
    this.skuForm = new FormGroup({
      name: new FormControl("", Validators.required),
      gst: new FormControl("", Validators.required),
      tds: new FormControl(""),
      description: new FormControl(""),
    });

    this.typeSearch.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.typeFilters = {};
        this.skuFilters = {};
        this.categoryFilters.search = value;
        this.typeFilters.search = value;
        this.skuFilters.search = value;
      });

    this.categoryConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-50', sortable: true },
        // { label: 'Types', field: 'citiec', type: 'text', styleClass: 'w-10'},
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5' },
      ],
      actions: [
        { icon: 'i-Blinklist', hint: 'Select', code: 'listTypes', style: 'primary' },
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editCategory', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-25 icons-td',
      }
    }
    this.typeConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-50', sortable: true },
        // { label: 'Skus', field: 'skuc', type: 'text', styleClass: 'w-10'},
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5' },
      ],
      actions: [
        { icon: 'i-Blinklist', hint: 'Select', code: 'listSkus', style: 'primary' },
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editType', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-25 icons-td',
      }
    }
    this.skuConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-40', sortable: true },
        { label: 'Asset', field: 'isAsset', type: 'boolean', styleClass: 'w-5' },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5' },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editSku', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td',
      }
    }
  }

  openedModal: any;
  openCategoryModal() {
    this.loading = false;
    this.openedModal = this.dialogs.modal(this.categoryModal, { size: 'md', backdrop: 'static' });
    var self = this;
    this.openedModal.result.then(function() {
      self.category = {};
    }).catch(function(e) {
      self.category = {};
    })
  }
  openTypeModal() {
    this.loading = false;
    this.openedModal = this.dialogs.modal(this.typeModal, { size: 'md', backdrop: 'static' });
    var self = this;
    this.openedModal.result.then(function() {
      self.type = {};
    }).catch(function(e) {
      self.type = {};
    })
  }
  skuTypeCode:any;
  openSkuModal() {
    this.listAllUnits();
    this.loading = false;
    this.skuTypeCode = this.selectedType.code;
    this.openedModal = this.dialogs.modal(this.skuModal, { size: 'md', backdrop: 'static' });
    var self = this;
    this.openedModal.result.then(function() {
      self.sku = {};
    }).catch(function(e) {
      self.sku = {};
    })
  }
  openSkuUnitModal() {
    this.loading = false;
    this.openedModal = this.dialogs.modal(this.skuUnitModal, { size: 'md', backdrop: 'static' });
    var self = this;
    this.openedModal.result.then(function() {
      self.skuUnit = {};
    }).catch(function(e) {
      self.skuUnit = {};
    })
  }

  saveCategory() {
    console.log("SkusComponent ::: save :: category ", this.category);
    this.loading = true;
    let self = this;
    this.service.saveCategory(this.category).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Sku Category '" + this.category.name + "' is saved successfully ");
        this.loading = false;
        self.categoryList.reset();
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  saveType() {
    console.log("SkusComponent ::: save :: type ", this.type);
    this.loading = true;
    let self = this;
    this.type.catId = this.selectedCategory.id;
    this.service.saveType(this.type).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Sku Type '" + this.type.name + "' is saved successfully ");
        this.loading = false;
        self.typeList.reset();
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  saveSku() {
    console.log("SkusComponent ::: save :: sku ", this.sku);
    this.loading = true;
    let self = this;
    this.sku.catId = this.selectedCategory.id;
    this.sku.typeId = this.selectedType.id;
    this.service.saveSku(this.sku).pipe(take(1)).subscribe(
      res => {
        if(this.sku.typeCode){
          this.selectedType.code = this.sku.typeCode;
        }
        self.dialogs.success("Sku '" + this.sku.name + "' is saved successfully ");
        this.loading = false;
        self.skuList.reset();
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
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
        this.openedModal.close();
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

  action(event) {
    console.log("SkusComponent ::: action :: event ", event);
    if (event.action == 'editCategory') {
      this.category = _.clone(event.item);
      this.openCategoryModal();
    } else if (event.action == 'listTypes') {
      if (this.selectedCategory) {
        this.selectedCategory.selected = false;
      }
      this.selectedCategory = event.item;
      event.item.selected = true;
      this.skuFilters.typeId = null;
      this.typeFilters.catId = event.item.id;
    } else if (event.action == 'editType') {
      this.type = _.clone(event.item);
      this.openTypeModal();
    } else if (event.action == 'listSkus') {
      if (this.selectedType) {
        this.selectedType.selected = false;
      }
      this.selectedType = event.item;
      event.item.selected = true;
      this.skuFilters.typeId = event.item.id;
    } else if (event.action == 'editSku') {
      this.sku = _.clone(event.item);
      this.sku.isService = this.sku.isService != null ? this.sku.isService : 0;
      this.openSkuModal();
    }
  }


}
