import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';

@Component({
  selector: 'admin-helpnotes',
  templateUrl: './view.component.html'
})
export class AdminHelpNotesComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  searchBusinessTerm: FormControl = new FormControl();
  form: FormGroup;
  businessTermForm: FormGroup;

  helpNotes: any = {};
  config: any = {};
  @ViewChild('list') list: any;
  @ViewChild('helpNotesModal') helpNotesModal: any;
  @ViewChild('businessTermsModal') businessTermsModal: any;

  openedModal: any;
  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  filter: any = {};

  sections: any = [{ name: 'Admin', contexts: ['ContractingDesc','ContractingFlow','BuildingDesc','BuildingFlow','CarpetSBAImage'] },
  { name: 'Booking', contexts: ['OfficeBookingStatusDefinition', 'OfficeBookingStatusFlow','LongTermBooking', 'ShortTermBooking', 'PrivateCabin',
                                'ResourseBookingStatusDefinition', 'ResourceBookingStatusFlow','ContractStatusDefinition', 'ContractStatusFlow',] },
  { name: 'Accounts', contexts: ['PaymentModeDefinition','PayoutStatusDefinition', 'PayoutStatusFlow','PGReconciliationTerms',
                                'DebitEntriesImportFormat','CreditEntriesImportFormat','DebitCardEntriesImportFormat'] },
  { name: 'Leads', contexts: ['StatusDefinition', 'StatusFlow'] },
  { name: 'Purchases', contexts: ['POStatusDefinition', 'POStatusFlow','WOStatusDefinition', 'WOStatusFlow','VendorStatusDefinition', 'VendorStatusFlow','MileStoneStatusDefinition', 'MileStoneStatusFlow',
                                'ProjectStatusDefinition', 'ProjectStatusFlow','RegisterBill','BillToPay','CapexBillsStatusDefinition', 'CapexBillsStatusFlow'] },
  { name: 'Support', contexts: ['StatusDefinition', 'StatusFlow'] },
  { name: 'Reports', contexts: ['RevenueOverAll', 'RevenueBuilding', 'RevenueClient','BuildingExpenses','HOExpenses',
                                'AR','TDSAR','SDLiability','ProductsList','CustomersList','InvoicesList','VendorsList','BillsList',
                                'Availability','ProductAnalysis','Support','BuildingCapex','ProjectCapex','TdsDueClientsList'] },
  { name: 'Dashboards', contexts: ['ProjectCapex', 'BuildingExpenses', 'ProductRevenue','ProfitandLoss']},
  { name: 'Assets', contexts: ['StatusDefinition', 'StatusFlow'] },
  ];

  businessTerm: any = {};
  allBusinessTerms: any = [];
  businessTerms: any = [];

  constructor(private dialogs: DialogsService, private service: AdminService,
    private uploadService: UploadService) { }

  ngOnInit() {
    this.form = new FormGroup({
      section: new FormControl("", Validators.required),
      context: new FormControl("", Validators.required),
      content: new FormControl("", Validators.required),
    });

    this.businessTermForm = new FormGroup({
      section: new FormControl("", Validators.required),
      acronym: new FormControl("", Validators.required),
      term: new FormControl("", Validators.required),
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .pipe(take(1)).subscribe(value => {
        this.filter.search = value;
      });

    this.searchBusinessTerm.valueChanges
      .pipe(debounceTime(200))
      .pipe(take(1)).subscribe(value => {
        this.searchBusinessTerms();
      });

    this.config = {
      columns: [
        { label: 'Section', field: 'section', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'Context', field: 'context', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'Content', field: 'content', type: 'text', styleClass: 'w-60', sortable: true },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'edit', style: 'info' },
        { icon: 'i-Folder-Trash', hint: 'Delete', code: 'delete', style: 'danger' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td text-center',
      }
    }
  }

  roles: any = [];
  openHelpNoteModal(content) {
    this.openedModal = this.dialogs.modal(content, { size: 'md', backdrop: 'static' });
    var self = this;
    this.openedModal.result.then(function() {
      self.helpNotes = {};
    }).catch(function(e) {
      self.helpNotes = {};
    })
  }

  openBusinessTerms() {
    this.listBusinessTerms();
    this.openedModal = this.dialogs.modal(this.businessTermsModal, { size: 'lg', backdrop: 'static' });
    var self = this;
    this.openedModal.result.then(function() {
      self.businessTerm = {};
      this.businessTermForm.reset();
    }).catch(function(e) {
      self.businessTerm = {};
      this.businessTermForm.reset();
    })
  }

  save() {
    console.log("HelpNotesComponent ::: save :: helpNotes ", this.helpNotes);
    this.loading = true;
    var self = this;
    var helpNotes = _.clone(this.helpNotes);
    helpNotes.section = helpNotes.selectedSection.name;
    this.service.saveHelpNote(helpNotes).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("HelpNotes for '" + this.helpNotes.context + "' is saved successfully ");
        self.loading = false;
        self.list.reset();
        self.form.reset();
        self.helpImage = null;
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  action(event) {
    console.log("HelpNotesComponent ::: action :: event ", event);
    if (event.action == 'edit') {
      var helpNotes = _.clone(event.item);
      helpNotes.selectedSection = _.find(this.sections, { name: helpNotes.section });
      this.helpNotes = helpNotes;
      this.openHelpNoteModal(this.helpNotesModal);
    } else if (event.action == 'delete') {
      this.delete(_.clone(event.item));
    }
  }

  delete(item) {
    if (item.id) {
      let self = this;
      this.dialogs.confirm("Are you sure to delete HelpNotes for '" + item.context + "'?")
        .then(function(event) {
          console.log("HelpNotesComponent ::: delete :: swal event ", event);
          if (event.value) {
            self.loading = true;
            self.service.deleteHelpNote(item.id).pipe(take(1)).subscribe(
              res => {
                self.dialogs.success("HelpNote for '" + item.context + "' is deleted successfully ")
                self.loading = false;
                self.list.reset();
              },
              error => {
                self.dialogs.error(error, 'Error while deleting')
              }
            )
          } else if (event.dismiss) {
            self.dialogs.warning('HelpNote deletion action is cancelled  ')
          }
        })
    }
  }

  listBusinessTerms() {
    this.service.listBusinessTerms({})
      .pipe(take(1)).subscribe((res) => {
        if (res['data']) {
          this.allBusinessTerms = res['data'];
          this.searchBusinessTerms();
        }
      })
  }

  saveBusinessTerm() {
    console.log("HelpNotesComponent ::: saveBusinessTerm :: businessTerm ", this.businessTerm);
    this.loading = true;
    var self = this;
    var businessTerm = _.clone(this.businessTerm);
    businessTerm.section = businessTerm.section;
    this.service.saveBusinessTerm(businessTerm).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Business Term of '" + this.businessTerm.acronym + "' is saved successfully ");
        self.loading = false;
        this.termForm = false;
        this.businessTermForm.reset();
        self.listBusinessTerms();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  editBusinessTerm(term) {
    this.businessTerm = _.clone(term);
    this.termForm = true;
  }
  deleteBusinessTerm(item) {
    if (item.id) {
      let self = this;
      this.dialogs.confirm("Are you sure to delete Business Term of '" + item.acronym + "'?")
        .then(function(event) {
          console.log("HelpNotesComponent ::: delete :: swal event ", event);
          if (event.value) {
            self.loading = true;
            self.service.deleteBusinessTerm(item.id).pipe(take(1)).subscribe(
              res => {
                self.dialogs.success("BusinessTerm of '" + item.acronym + "' is deleted successfully ")
                self.loading = false;
                self.listBusinessTerms();
              },
              error => {
                self.dialogs.error(error, 'Error while deleting')
              }
            )
          } else if (event.dismiss) {
            self.dialogs.warning('HelpNote deletion action is cancelled  ')
          }
        })
    }
  }

  businessTermSection: any;
  businessTermSearch: any;
  searchBusinessTerms() {
    var businessTerms = this.allBusinessTerms;
    if (this.businessTermSection) {
      businessTerms = _.filter(this.allBusinessTerms, { section: this.businessTermSection });
    }
    if (this.businessTermSearch && this.businessTermSearch != '') {
      var search = this.businessTermSearch.toLowerCase();
      businessTerms = _.filter(businessTerms, function(t) {
        var term = t.term.toLowerCase();
        return term.indexOf(search) > -1;
      })
    }
    this.businessTerms = businessTerms;
    this.sortBy('acronym');
  }

  termForm: boolean = false;
  cancelBusinessTerm() {
    this.termForm = false;
  }


  sort: any = {}
  sortBy(col) {
    var sort = _.clone(this.sort);
    var _sort = {};
    var sortType = 'asc';
    if (sort[col] && sort[col].asc) {
      sort[col].asc = false;
      sort[col].desc = true;
      sortType = 'desc';
      this.sort = sort;
    } else {
      _sort[col] = { asc: true };
      this.sort = _sort;
    }
    var data = _.clone(this.businessTerms);
    this.businessTerms = _.orderBy(data, [col], [sortType]);
  }

  helpImage: any;
  helpImageChange(event) {
    this.helpImage = event.target.files[0];
  }
  helpImageUploadResponse: any = { status: '', message: '', filePath: '' };
  helpImageError: any;
  uploadHelpImageFile() {
    const formData = new FormData();
    formData.append('file', this.helpImage);

    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.helpImageUploadResponse = res;
        if (res.file) {
          this.loading = false;
          this.helpNotes.file = res.file;
        }
      },
      (err) => this.helpImageError = err
    );
  }

}
