import { Component, ViewChild, EventEmitter, OnInit, OnDestroy, Input, Output, ElementRef, KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from "@angular/core";
import { Observable, combineLatest, Subscription } from 'rxjs';
import { InfiniteScrollDirective } from '../../directives/infinite.scroll.directive';
import { CommonService } from '../../services/common.service';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { Helpers } from '../../../helpers';

import * as _ from "lodash";

@Component({
	selector: "data-list",
	templateUrl: './datalist.component.html',
})
export class DataListComponent implements OnInit, OnDestroy {
	@ViewChild(InfiniteScrollDirective) infiniteScroll;

	@Input('autoHeightAdjust') autoHeightAdjust: boolean;
	@Input() dataUrl: string;
	@Input() data: Array<any>;

	@Input() config: any;
	@Input() filter: any;
	@Input() items: any;

	@Output() onLoadMore = new EventEmitter();
	@Output() onAction = new EventEmitter();
	@Output() onSortBy = new EventEmitter();
	@Output() onRowSelected = new EventEmitter();
	@Output() onItemValueChanged = new EventEmitter();

	user: any = JSON.parse(localStorage.getItem('currentUser'));

	oldDataUrl: string;

	allRows: boolean = false;

	offset: number = 0;
	@Input() limit: any = 20;

	sortBy: string;
	sortOrder: string;

	updateData: boolean = false;
	debounceDelay: number = 500; // 500 ms debounce of filter change
	nextUpdateTime: number;

	infiniteScrollInitiated: boolean = false;
	loading: boolean = false;
	noMoreData: boolean = false;
	baseUrl: string = "";

	private filterDiffers: KeyValueDiffer<string, any>;

	loadMoreSubscription: Subscription;

	constructor(private commonService: CommonService, private differs: KeyValueDiffers, private dialogs: DialogsService) {
		this.data = [];
	}

	ngOnDestroy() {
		if (this.loadMoreSubscription) {
			this.loadMoreSubscription.unsubscribe();
			console.log("loadmore observable destroyed .. ");
		}
	}

	ngOnInit() {
		if (this.autoHeightAdjust == null) {
			this.autoHeightAdjust = true;
		}
		console.log('ng init datalist component: ' + this.dataUrl);

		if (this.dataUrl) {
			this.baseUrl = Helpers.composeEnvUrl();
			this.data = [];
		} else if (this.items && this.items.length) {
			this.data = this.items;
		}

		if (!this.config['actions']) {
			this.config['actions'] = [];
		}

		if (this.config['options']) {
			if (this.config['options']['initialSort']) {
				this.sortBy = this.config['options']['initialSort']['by'];
				this.sortOrder = this.config['options']['initialSort']['order'];
			}

			if (this.config['options']['debounceDelay'] !== undefined) {
				this.debounceDelay = this.config['options']['debounceDelay'];
			}
		}

		if (this.filter) {
			this.filterDiffers = this.differs.find(this.filter).create();
		}
		console.log("DataListComponent :: limit :: ", this.limit);
	}

	ngDoCheck(): void {

		if (this.oldDataUrl != this.dataUrl) {
			this.oldDataUrl = this.dataUrl;
			this.reset();
			return;
		}

		if (this.filter && this.filterDiffers) {
			const changes = this.filterDiffers.diff(this.filter);

			if (changes) {
				console.log('filter changed!: ' + this.debounceDelay);
				this.data = [];

				this.filterChanged(changes);
				// if (this.debounceDelay <= 0) {
				// 	this.filterChanged(changes);
				// } else {
				// 	this.nextUpdateTime = new Date().getTime() + this.debounceDelay;
				// 	if (!this.updateData) {
				// 		this.updateData = true;
				// 	}

				// 	setTimeout(() => {
				// 		console.log('timpout');
				// 		if (new Date().getTime() > this.nextUpdateTime) {
				// 			this.filterChanged(changes);
				// 		}
				// 	}, this.debounceDelay);
				// }
			}
		}
	}

	public columnClicked(colIdx: number) {

		if (!this.config['columns'][colIdx]['sortable'] || this.config['columns'][colIdx]['type'] == 'custom') {
			return;
		}

		this.sortBy = this.config['columns'][colIdx]['field'];
		if (!this.sortOrder) {
			this.sortOrder = 'asc';
		} else {
			if (this.sortOrder == 'asc') {
				this.sortOrder = 'desc';
			} else {
				this.sortOrder = 'asc';
			}
		}


		this.onSortBy.emit({
			colIdx: colIdx,
			sorting: {
				by: this.sortBy,
				order: this.sortOrder
			}
		});

		this.reset();
	}

	filterChanged(changes: KeyValueChanges<string, any>) {
		this.reset();
	}

	public actionClicked(rowIdx: number, action: string, item: any) {
		console.log(item);
		this.onAction.emit({
			rowIdx: rowIdx,
			action: action,
			item: item,
		});
	}

	public loadMore() {
		if (this.dataUrl && !this.noMoreData) {
			if (this.loading) {
				return;
			}

			console.log("DataListComponent :: limit :: ", this.limit);
			this.loading = true;
			// Helpers.setTableLoading(this.loading);
			this.loadMoreSubscription = this.commonService.fetchList(this.dataUrl, this.offset, this.limit, this.filter, this.sortBy, this.sortOrder).subscribe(
				res => {
					// console.log("datalist component res : ", res);
					if (!res['error']) {
						if (res['data'] && res['data'].length) {
							this.data = this.data.concat(res['data']);
							this.offset = this.offset + this.limit;

							this.noMoreData = res['data'].length < this.limit;
						} else {
							this.noMoreData = true;
						}

						this.updateData = false;
						this.loading = false;
						// Helpers.setTableLoading(this.loading);

						if (!this.infiniteScrollInitiated && this.data.length > 0) {
							this.infiniteScrollInitiated = true;
							var self = this;
							setTimeout(function() {
								// self.infiniteScroll.updateTableHeight();
							}, 500);
						}
						this.onLoadMore.emit({ count: this.data.length });
					} else {
						this.loading = false;
						this.dialogs.error(res['error'], "Error");
					}
				},
				error => {

				}
			);
		} else {
			this.onLoadMore.emit({ count: this.data.length });
		}
	}

	public itemValueChanged(item: any, field: string) {
		this.onItemValueChanged.emit({
			item: item,
			field: field
		})
	}

	public rowSelected(rowIdx: number) {
		this.onRowSelected.emit({
			rowIdx: rowIdx,
			rows: this.getSelectedRows()
		});
	}

	public updateItem(rowIdx: number, updatedItem: any) {
		this.data[rowIdx] = updatedItem;
	}

	public removeItem(rowIdx: number, deletedItem: any) {
		// this.data = _.remove(this.data, deletedItem);
		this.data = this.data.splice(rowIdx, 1);
	}

	public calculateRowStyleClass(row: any) {
		var classs = "";
		if (this.config['options'] && this.config['options']['rowStyling']) {
			if (this.config['options']['rowStyling']['type'].toLowerCase() == 'static') {
				classs = this.config['options']['rowStyling']['styleClass'];
			} else
				if (this.config['options']['rowStyling']['type'].toLowerCase() == 'dynamic') {
					classs = this.config['options']['rowStyling']['styleClassMap'][row[this.config['options']['rowStyling']['field']]];
				}
		}
		if (row && row.selected) {
			classs = classs + " selected";
		}
		if (row && row.lightSelected) {
			classs = classs + " selected-light";
		}
		if (row && row.success) {
			classs = classs + " bg-success";
		}
		if (row && row.danger) {
			classs = classs + " bg-danger";
		}
		if (row && row.warning) {
			classs = classs + " bg-warning";
		}
		if (row && row.lightRed) {
			classs = classs + " bg-light-red";
		}
		if (row && row.active == 0) {
			classs = classs + " inactive";
		}

		return classs;
	}

	public selectAll() {
		for (let i = 0; i < this.data.length; i++) {
			this.data[i]['_selected'] = this.allRows;
		}

		this.onRowSelected.emit({
			rows: this.getSelectedRows()
		});
	}

	public getItems() {
		return this.data;
	}

	public reset(limit?: any, data?: any) {
		console.log("data list : reset called .. ")
		this.noMoreData = false;
		this.offset = 0;
		this.limit = limit || this.limit;
		if (this.dataUrl) {
			this.data = [];
			this.loadMore();
		} else {
			this.data = data || this.items;
		}
	}

	public objVal(obj, is, value) {
		if (obj == null || is == null) {
			return null;
		} else
			if (typeof is == 'string')
				return this.objVal(obj, is.split('.'), value);
			else
				if (is.length == 1 && value !== undefined)
					return obj[is[0]] = value;
				else
					if (is.length == 0)
						return obj;
					else
						return this.objVal(obj[is[0]], is.slice(1), value);
	}

	public convertItem(item: any, column: any) {
		if (column['converter']) {
			if (column['converter'] == 'json') {
				return JSON.parse(item[column['field']]);
			}
		} else {
			return item;
		}
	}

	public getSelectedRows(): Array<any> {

		let result = [];

		for (let i = 0; i < this.data.length; i++) {
			if (this.data[i]['_selected']) {
				result.push(this.data[i]);
			}
		}

		return result;
	}

	identify(index, item?) {
		return item ? item.id : index;
	}
}
