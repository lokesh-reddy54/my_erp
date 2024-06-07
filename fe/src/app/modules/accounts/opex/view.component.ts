import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';

@Component({
  selector: 'accounts-opexs',
  templateUrl: './view.component.html'
})
export class OpexsComponent implements OnInit {
  typeSearch: FormControl = new FormControl();
  opexSearch: FormControl = new FormControl();
  form: FormGroup;
  categoryForm: FormGroup;
  opexForm: FormGroup;

  selectedCategory: any;
  selectedType: any;
  category: any = {};
  type: any = {};
  opex: any = {};
  categoryConfig: any = {};
  typeConfig: any = {};
  opexConfig: any = {};
  @ViewChild('categoryModal') categoryModal: any;
  @ViewChild('typeModal') typeModal: any;
  @ViewChild('opexModal') opexModal: any;
  @ViewChild('categoryList') categoryList: any;
  @ViewChild('typeList') typeList: any;
  @ViewChild('opexList') opexList: any;

  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  categoryFilters: any = {};
  typeFilters: any = {};
  opexFilters: any = {};

  opexsObservable: Observable<any[]>;

  isHq: any = 0;
  constructor(private dialogs: DialogsService, private service: AccountsService, private route: ActivatedRoute) {
    this.isHq = parseInt(this.route.snapshot.params['ho']);
  }

  ngOnInit() {
    this.categoryFilters = { office: this.isHq };

    this.form = new FormGroup({
      name: new FormControl("", Validators.required),
    });
    this.categoryForm = new FormGroup({
      name: new FormControl("", Validators.required),
    });
    this.opexForm = new FormGroup({
      name: new FormControl("", Validators.required),
    });

    this.typeSearch.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.typeFilters.search = value;
      });
    this.opexSearch.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.opexFilters.search = value;
      });

    this.categoryConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-40', sortable: true },
        { label: 'Default', field: 'default', type: 'boolean', styleClass: 'w-10' },
        { label: 'Recurring', field: 'recurring', type: 'boolean', styleClass: 'w-10' },
        { label: 'System', field: 'system', type: 'boolean', styleClass: 'w-10' },
        // { label: 'OfficeExpense', field: 'office', type: 'boolean', styleClass: 'w-10' },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-10' },
      ],
      actions: [
        { icon: 'i-Blinklist', hint: 'Select', code: 'listTypes', style: 'primary' },
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editCategory', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-20 icons-td',
      }
    }
    this.typeConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-50', sortable: true },
        // { label: 'Category', field: 'category.name', type: 'text', styleClass: 'w-40', sortable: true },
        // { label: 'Opexs', field: 'opexc', type: 'text', styleClass: 'w-10'},
        { label: 'Default', field: 'default', type: 'boolean', styleClass: 'w-5' },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5' },
      ],
      actions: [
        { icon: 'i-Blinklist', hint: 'Select', code: 'listOpexs', style: 'primary' },
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editType', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-25 icons-td',
      }
    }
    this.opexConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-40', sortable: true },
        // { label: 'Type', field: 'type.name', type: 'text', styleClass: 'w-40', sortable: true },
        { label: 'Default', field: 'default', type: 'boolean', styleClass: 'w-5' },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5' },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editOpex', style: 'info' }
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
  openOpexModal() {
    this.loading = false;
    this.openedModal = this.dialogs.modal(this.opexModal, { size: 'md', backdrop: 'static' });
    var self = this;
    this.openedModal.result.then(function() {
      self.opex = {};
    }).catch(function(e) {
      self.opex = {};
    })
  }

  saveCategory() {
    console.log("OpexsComponent ::: save :: category ", this.category);
    this.loading = true;
    let self = this;
    this.category.office = this.isHq;
    this.service.saveCategory(this.category).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Opex Category '" + this.category.name + "' is saved successfully ");
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
    console.log("OpexsComponent ::: save :: type ", this.type);
    this.loading = true;
    let self = this;
    this.type.catId = this.selectedCategory.id;
    this.service.saveType(this.type).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Opex Type '" + this.type.name + "' is saved successfully ");
        this.loading = false;
        self.typeList.reset();
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  saveOpex() {
    console.log("OpexsComponent ::: save :: opex ", this.opex);
    this.loading = true;
    let self = this;
    this.opex.typeId = this.selectedType.id;
    this.service.saveType(this.opex).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Opex '" + this.opex.name + "' is saved successfully ");
        this.loading = false;
        self.opexList.reset();
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  action(event) {
    console.log("OpexsComponent ::: action :: event ", event);
    if (event.action == 'editCategory') {
      this.category = _.clone(event.item);
      this.openCategoryModal();
    } else if (event.action == 'listTypes') {
      if (this.selectedCategory) {
        this.selectedCategory.selected = false;
      }
      this.selectedCategory = event.item;
      event.item.selected = true;
      this.opexFilters = {};
      this.typeFilters.catId = event.item.id;
    } else if (event.action == 'editType') {
      this.type = _.clone(event.item);
      this.openTypeModal();
    } else if (event.action == 'listOpexs') {
      if (this.selectedType) {
        this.selectedType.selected = false;
      }
      this.selectedType = event.item;
      event.item.selected = true;
      this.opexFilters.typeId = event.item.id;
    } else if (event.action == 'editOpex') {
      this.opex = _.clone(event.item);
      this.openOpexModal();
    }
  }


}
