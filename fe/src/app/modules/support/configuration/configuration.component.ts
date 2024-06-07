import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { CommonService } from 'src/app/shared/services/common.service';
import { SupportService } from 'src/app/shared/services/support.service';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';

@Component({
  selector: 'support-configuration',
  templateUrl: './configuration.component.html'
})
export class SupportConfigurationComponent implements OnInit {
  categoryForm: FormGroup;
  subCategoryForm: FormGroup;
  contextForm: FormGroup;
  priorityForm: FormGroup;

  selectedCategory: any = {};
  selectedSubCategory: any = {};
  selectedContext: any = {};
  selectedPriority: any = {};
  category: any = {};
  subCategory: any = {};
  context: any = {};
  priority: any = {};
  categoryConfig: any = {};
  subCategoryConfig: any = {};
  contextConfig: any = {};
  priorityConfig: any = {};

  @ViewChild('categoryModal') categoryModal: any;
  @ViewChild('subCategoryModal') subCategoryModal: any;
  @ViewChild('contextModal') contextModal: any;
  @ViewChild('priorityModal') priorityModal: any;
  @ViewChild('prioritiesListModal') prioritiesListModal: any;
  @ViewChild('categoriesList') categoriesList: any;
  @ViewChild('subCategoriesList') subCategoriesList: any;
  @ViewChild('contextsList') contextsList: any;
  @ViewChild('prioritiesList') prioritiesList: any;

  items: any = [];
  assigneeTypes: any = [];
  supportLevels: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;

  constructor(private dialogs: DialogsService, private service: SupportService, private commonService: CommonService) {
    this.assigneeTypes = this.commonService.values.ticketAssigneeTypes;
    this.supportLevels = this.commonService.values.ticketSupportLevels;
  }

  ngOnInit() {
    this.categoryForm = new FormGroup({
      name: new FormControl("", Validators.required),
    });
    this.subCategoryForm = new FormGroup({
      name: new FormControl("", Validators.required),
    });
    this.contextForm = new FormGroup({
      context: new FormControl("", Validators.required),
      priorityId: new FormControl("", Validators.required),
      supportLevel: new FormControl("", Validators.required),
      assigneeType: new FormControl("", Validators.required),
    });
    this.priorityForm = new FormGroup({
      name: new FormControl("", Validators.required),
      attendIn: new FormControl("", Validators.required),
      attendInType: new FormControl("", Validators.required),
      resolveIn: new FormControl("", Validators.required),
      resolveInType: new FormControl("", Validators.required),
      closeIn: new FormControl("", Validators.required),
      closeInType: new FormControl("", Validators.required),
    });

    // this.facilitySearch.valueChanges
    //   .pipe(debounceTime(200))
    //   .pipe(take(1)).subscribe(value => {
    //     this.facilitySetFilters.search = value;
    //   });

    this.categoryConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-50', sortable: true },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5' },
      ],
      actions: [
        { icon: 'i-Blinklist', hint: 'Select Category', code: 'selectCategory', style: 'primary' },
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editCategory', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-25 icons-td text-center',
      }
    }
    this.subCategoryConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-50', sortable: true },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5' },
      ],
      actions: [
        { icon: 'i-Blinklist', hint: 'Select SubCategory', code: 'selectSubCategory', style: 'primary' },
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editSubCategory', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-25 icons-td text-center',
      }
    }
    this.contextConfig = {
      columns: [
        { label: 'Context', field: 'context', type: 'text', styleClass: 'w-30', sortable: true },
        { label: 'Priority', field: 'priority.name', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'Assignee', field: 'assigneeType', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'LineLevel', field: 'supportLevel', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5' },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editContext', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-5 icons-td text-center',
      }
    }
    this.priorityConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-50', sortable: true },
        { label: 'AttendId', field: 'attendIn', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'ResolveId', field: 'resolveIn', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'CloseIn', field: 'closeIn', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-10' },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editPriority', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td text-center',
      }
    }

    this.loadPriorities();
  }

  priorities: any = [];
  loadPriorities() {
    this.service.getPriorities().pipe(take(1)).subscribe(
      res => {
        this.priorities = res['data'];
      }
    )
  }

  openedModal: any;
  openCategoryModal() {
    this.loading = false;
    this.openedModal = this.dialogs.modal(this.categoryModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.category = {};
    }).catch(function(e) {
      self.category = {};
    })
  }
  openSubCategoryModal() {
    this.loading = false;
    this.openedModal = this.dialogs.modal(this.subCategoryModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.subCategory = {};
    }).catch(function(e) {
      self.subCategory = {};
    })
  }
  openContextModal() {
    this.loading = false;
    this.openedModal = this.dialogs.modal(this.contextModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.context = {};
    }).catch(function(e) {
      self.context = {};
    })
  }
  openPriorityModal() {
    this.loading = false;
    this.openedModal = this.dialogs.modal(this.priorityModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
    }).catch(function(e) {
    })
  }
  openPrioritiesModal() {
    this.loading = false;
    this.openedModal = this.dialogs.modal(this.prioritiesListModal, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.priority = {};
    }).catch(function(e) {
      self.priority = {};
    })
  }

  saveTicketCategory() {
    console.log("LocationsComponent ::: save :: category ", this.category);
    this.loading = true;
    let self = this;
    this.service.saveTicketCategory(this.category).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Category '" + this.category.name + "' is saved successfully ");
        this.loading = false;
        self.categoriesList.reset();
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  saveTicketSubCategory() {
    console.log("LocationsComponent ::: save :: subCategory ", this.subCategory);
    this.loading = true;
    let self = this;
    this.subCategory.categoryId = this.selectedCategory.id;
    this.service.saveTicketSubCategory(this.subCategory).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Category '" + this.subCategory.name + "' is saved successfully ");
        this.loading = false;
        var subCategory = _.find(this.selectedCategory.subCategories, { id: res['data']['id'] });
        if (subCategory) {
          subCategory.name = this.subCategory.name;
          subCategory.active = this.subCategory.active;
        } else {
          this.selectedCategory.subCategories.push(res['data']);
        }
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  saveTicketContext() {
    console.log("LocationsComponent ::: save :: context ", this.context);
    this.loading = true;
    let self = this;
    this.context.subCategoryId = this.selectedSubCategory.id;
    this.service.saveTicketContext(this.context).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Context '" + this.context.context + "' is saved successfully ");
        this.loading = false;
        var context = _.find(this.selectedSubCategory.contexts, { id: res['data']['id'] });
        if (context) {
          context.context = this.context.context;
          context.assigneeType = this.context.assigneeType;
          context.supportLevel = this.context.supportLevel;
          context.active = this.context.active;
        } else {
          context = res['data'];
          var priority = _.find(this.priorities, {id: context.priorityId});
          context.priority = priority;
          this.selectedSubCategory.contexts.push(context);
        }
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  savePriority() {
    console.log("LocationsComponent ::: save :: priority ", this.priority);
    this.loading = true;
    let self = this;
    this.service.savePriority(this.priority).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Priority '" + this.priority.name + "' is saved successfully ");
        this.loading = false;
        self.loadPriorities();
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  currentContexts = [];
  currentSubCategories = [];
  action(event) {
    console.log("LocationsComponent ::: action :: event ", event);
    if (event.action == 'editCategory') {
      this.category = _.clone(event.item);
      this.openCategoryModal();
    } else if (event.action == 'editSubCategory') {
      this.subCategory = _.clone(event.item);
      this.openSubCategoryModal();
    } else if (event.action == 'editContext') {
      this.context = _.clone(event.item);
      this.openContextModal();
    } else if (event.action == 'editPriority') {
      this.priority = _.clone(event.item);
      this.priority.attendIn = parseInt(this.priority.attendIn);
      this.priority.resolveIn = parseInt(this.priority.resolveIn);
      this.priority.closeIn = parseInt(this.priority.closeIn);
      this.openPriorityModal();
    } else if (event.action == 'selectCategory') {
      if (this.selectedCategory) {
        this.selectedCategory.selected = false;
      }
      event.item.selected = true;
      this.selectedCategory = event.item;
      this.currentSubCategories = this.selectedCategory.subCategories;
      if (this.subCategoriesList) {
        this.subCategoriesList.reset(null, this.currentSubCategories);
      }
    } else if (event.action == 'selectSubCategory') {
      if (this.selectedSubCategory) {
        this.selectedSubCategory.selected = false;
      }
      event.item.selected = true;
      this.selectedSubCategory = event.item;
      this.currentContexts = this.selectedSubCategory.contexts;
      if (this.contextsList) {
        this.contextsList.reset(null, this.currentContexts);
      }
    }
  }

  editPriority(priority) {
    this.priority = priority;
    this.priority.attendIn = parseInt(this.priority.attendIn);
    this.priority.resolveIn = parseInt(this.priority.resolveIn);
    this.priority.closeIn = parseInt(this.priority.closeIn);
    this.openPriorityModal();
  }
}
