import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';

@Directive({
	selector: '[checkAccess]',
	exportAs: 'checkAccess'
})

export class CheckAccessDirective implements OnInit {
	constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef, private commonService: CommonService) { }

	elements: any;
	@Input() set checkAccess(elements: any) {
		this.elements = elements;
	}

	ngOnInit() {
		var flag = this.commonService.checkAccess(this.elements);
		// console.log("CheckAccess :: roles and rights ", this.elements, flag);

		if (flag) {
			this.viewContainer.createEmbeddedView(this.templateRef);
		} else {
			this.viewContainer.clear();
		}
	}

}