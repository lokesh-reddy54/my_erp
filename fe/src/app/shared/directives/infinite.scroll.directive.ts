import { Directive, Input, Output, ElementRef, EventEmitter } from '@angular/core';
import * as $ from "jquery";
// declare let $: any;

@Directive({
	selector: '[infiniteScroll]',
	host: {
		'(scroll)': 'onScrolled($event)'
	}
})
export class InfiniteScrollDirective {

	@Input('autoHeightAdjust') autoHeightAdjust: any = true;
	@Input('scrollDistance') scrollTrigger: number = 1;
	@Output() onScroll = new EventEmitter<any>();

	public _element: any;
	public _count: number;
	public isInitialised: boolean = false;

	constructor(public element: ElementRef) {
		this._element = this.element.nativeElement;
		var self = this;
		setTimeout(function() {
			if (self.autoHeightAdjust) {
				self.updateTableHeight();
			}
		}, 500)
	}

	// ngDoCheck() {
	// 	var self = this;
	// 	setTimeout(function() {
	// 		if (self.autoHeightAdjust) {
	// 			self.updateTableHeight();
	// 		}
	// 	}, 500)
	// }

	updateTableHeight() {
		if (!this.isInitialised) {
			this.onScroll.emit(null);
			this.isInitialised = true;
			var height;
			if (typeof this.autoHeightAdjust == 'number') {
				height = this.autoHeightAdjust;
				$(this._element).css("height", height + "px");
			} else {
				// table scroll height = body height - space occupied above table - thead height
				var bodyHeight = $("html")[0].clientHeight;
				// console.log("InfiniteScrollDirective " + bodyHeight);
				// var offsetTop = $(".tableBodyScroll")[0].getBoundingClientRect().top;
				var offsetTop = $(this._element)[0].getBoundingClientRect().top;
				// console.log("InfiniteScrollDirective " + offsetTop);
				height = bodyHeight - offsetTop - 10;
				// if ($(".tableBodyScroll tbody")) {
				// 	$(".tableBodyScroll tbody").css("height", height + "px");
				// } else {
				// 	$(".tableBodyScroll").css("height", height + "px");
				// }
				$(this._element).css("height", height + "px");

			}
			// $(".tableBodyScroll tbody").css("max-height", height + "px");
			// $(".tableBodyScroll tbody").css("min-height", height - 30 + "px");
		}
	}

	onScrolled() {
		this._count++;
		if (this._element.scrollTop + this._element.clientHeight + 100 >= this._element.scrollHeight) {
			// console.log(this._element.scrollTop + " " + (this._element.clientHeight + 100) + " " + this._element.scrollHeight)
			this.onScroll.emit(null);
		} else {
			if (this._count % this.scrollTrigger === 0) {
				this.onScroll.emit(null);
			}
		}
	}
}