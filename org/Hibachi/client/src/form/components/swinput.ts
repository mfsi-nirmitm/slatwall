/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />
/**
 * This validate directive will look at the current element, figure out the context (save, edit, delete) and
 * validate based on that context as defined in the validation properties object.
 */
import {SWFormController} from "./swform";
import {SWPropertyDisplayController} from "./swpropertydisplay";
import {SWFPropertyDisplayController} from "./swfpropertydisplay";
import {SWFormFieldController} from "./swformfield";
import {ObserverService} from "../../core/services/observerservice";
import {MetaDataService} from "../../core/services/metadataservice";
//defines possible eventoptions
type EventAnnouncer = "blur" |
	"change" |
	"click" |
	"copy" |
	"cut" |
	"dblclick" |
	"focus" |
	"keydown" |
	"keypress" |
	"keyup" |
	"mousedown" |
	"mouseenter" |
	"mouseleave" |
	"mousemove" |
	"mouseover" |
	"mouseup" |
	"paste";
class SWInputController{
	public propertyDisplay:any;
	public form:ng.IFormController;
	public swForm:SWFormController;
	public swPropertyDisplay:SWPropertyDisplayController;
	public swfPropertyDisplay:SWFPropertyDisplayController;
	public swFormField:SWFormFieldController;
	public class:string;
	public fieldType:string;
	public object:any;
	public inputAttributes:string;
	public initialValue:any;
	public inListingDisplay:boolean;
	public listingID:string;
	public pageRecordIndex:number;
	public propertyDisplayID:string;
	public noValidate:boolean;
	public propertyIdentifier:string;
	public binaryFileTarget:string;
	public rawFileTarget:string;
	public edit:boolean;
	public edited:boolean;
	public name:string;
	public value:any;
	public reverted:boolean;
	public revertToValue:any;
	public showRevert:boolean;
	public context:string;
	public eventNameForObjectSuccess:string;
	public rowSaveEnabled:boolean;

	public eventAnnouncers:string="";
	public eventAnnouncersArray:Array<EventAnnouncer>;
	public eventAnnouncerTemplate:string;

	//@ngInject
	constructor(
        public $scope,
		public $log,
        public $hibachi,
		public $injector,
		public listingService,
		public utilityService,
        public rbkeyService,
		public observerService:ObserverService,
		public metadataService:MetaDataService
	){
	}

	public onSuccess = ()=>{
        debugger;
		this.utilityService.setPropertyValue(this.swForm.object,this.propertyIdentifier,this.value);
		if(this.swPropertyDisplay){
			this.utilityService.setPropertyValue(this.swPropertyDisplay.object,this.propertyIdentifier,this.value);
		}
		if(this.swfPropertyDisplay){
			this.utilityService.setPropertyValue(this.swfPropertyDisplay.object,this.propertyIdentifier,this.value);
			this.swfPropertyDisplay.edit = false;
		}
		this.utilityService.setPropertyValue(this.swFormField.object,this.propertyIdentifier,this.value);
	}

	public getValidationDirectives = ()=>{
        debugger;
		var spaceDelimitedList = '';
		var name = this.propertyIdentifier;
		var form = this.form;
		this.$log.debug("Name is:" + name + " and form is: " + form);

		if(this.metadataService.isAttributePropertyByEntityAndPropertyIdentifier(this.object,this.propertyIdentifier)){
			this.object.validations.properties[name] = [];
			if((this.object.metaData[this.propertyIdentifier].requiredFlag && this.object.metaData[this.propertyIdentifier].requiredFlag == true) || typeof this.object.metaData[this.propertyIdentifier].requiredFlag === 'string' && this.object.metaData[this.propertyIdentifier].requiredFlag.trim().toLowerCase()=="yes"){
				this.object.validations.properties[name].push({
					contexts:"save",
					required:true
				});
			}
			if(this.object.metaData[this.propertyIdentifier].validationRegex){
				this.object.validations.properties[name].push({
					contexts:"save",regex:this.object.metaData[this.propertyIdentifier].validationRegex
				});
			}
		}

		if(angular.isUndefined(this.object.validations )
			|| angular.isUndefined(this.object.validations.properties)
			|| angular.isUndefined(this.object.validations.properties[this.propertyIdentifier])){
			return '';
		}
		var validations = this.object.validations.properties[this.propertyIdentifier];

		this.$log.debug("Validations: ", validations);
		this.$log.debug(this.form);
		var validationsForContext = [];

		//get the form context and the form name.


		var formContext = this.swForm.context;
		var formName = this.swForm.name;
		this.$log.debug("Form context is: ");
		this.$log.debug(formContext);
		this.$log.debug("Form Name: ");
		this.$log.debug(formName);
		//get the validations for the current element.
		var propertyValidations = this.object.validations.properties[name];

		//check if the contexts match.
		if (angular.isObject(propertyValidations)){
			//if this is a procesobject validation then the context is implied
			if(angular.isUndefined(propertyValidations[0].contexts) && this.object.metaData.isProcessObject){
				propertyValidations[0].contexts = this.object.metaData.className.split('_')[1];
			}

			if (propertyValidations[0].contexts.indexOf(formContext) > -1){
				this.$log.debug("Matched");
				for (var prop in propertyValidations[0]){
						if (prop != "contexts" && prop !== "conditions"){

							spaceDelimitedList += (" swvalidation" + prop.toLowerCase() + "='" + propertyValidations[0][prop] + "'");

						}
				}
			}
		this.$log.debug(spaceDelimitedList);
		}
		//loop over validations that are required and create the space delimited list
		this.$log.debug(validations);

		//get all validations related to the form context;
		this.$log.debug(form);

		angular.forEach(validations,(validation,key)=>{
			if(validation.contexts && this.utilityService.listFind(validation.contexts.toLowerCase(),this.swForm.context.toLowerCase()) !== -1){
				this.$log.debug("Validations for context");
				this.$log.debug(validation);
				validationsForContext.push(validation);
			}
		});

        console.log(spaceDelimitedList);
        debugger;
        return spaceDelimitedList;
	};

	public clear = () =>{
        if(this.reverted){
            this.reverted = false;
            this.showRevert = true;
        }
        this.edited = false;
        this.value= this.initialValue;
        if(this.inListingDisplay && this.rowSaveEnabled){
            this.listingService.markUnedited( this.listingID,
                                              this.pageRecordIndex,
                                              this.propertyDisplayID
                                            );
        }
    }

    public revert = () =>{
        this.showRevert = false;
        this.reverted = true;
        this.value = this.revertToValue;
        this.onEvent(<Event>{}, "change");
    }

	public onEvent = (event:Event,eventName:string):void=>{
		let customEventName = this.swForm.name+this.name+eventName;
		let formEventName = this.swForm.name + eventName;
		let data = {
			event:event,
			eventName:eventName,
			form:this.form,
			swForm:this.swForm,
			swInput:this,
			inputElement:$('input').first()[0]
		};
		this.observerService.notify(customEventName,data);
		this.observerService.notify(formEventName,data);
		this.observerService.notify(eventName,data);
	}

	public getTemplate = ()=>{
        debugger;
		var template = '';
		var validations = '';
		var currencyTitle = '';
		var currencyFormatter = '';
		var style = "";

		if(!this.class){
			this.class = "form-control";
		}

		if(!this.noValidate){
			validations = this.getValidationDirectives();
		}

		if(this.object && this.object.metaData && this.object.metaData.$$getPropertyFormatType(this.propertyIdentifier) != undefined && this.object.metaData.$$getPropertyFormatType(this.propertyIdentifier) == "currency"){
			currencyFormatter = 'sw-currency-formatter ';
			if(angular.isDefined(this.object.data.currencyCode)){
				currencyFormatter = currencyFormatter + 'data-currency-code="' + this.object.data.currencyCode + '" ';
				currencyTitle = '<span class="s-title">' + this.object.data.currencyCode + '</span>';
			}
		}

		var appConfig = this.$hibachi.getConfig();

		var placeholder ='';
		if(this.object.metaData && this.object.metaData[this.propertyIdentifier] && this.object.metaData[this.propertyIdentifier].hb_nullrbkey){
			placeholder = this.rbkeyService.getRBKey(this.object.metaData[this.propertyIdentifier].hb_nullrbkey);
		}

		if(this.fieldType.toLowerCase() === 'json'){
			style = style += 'display:none';
		}

		var acceptedFieldTypes = ['email','text','password','number','time','date','datetime','json','file'];

		if(acceptedFieldTypes.indexOf(this.fieldType.toLowerCase()) >= 0){
			var inputType = this.fieldType.toLowerCase();
			
			if(this.fieldType === 'time' || this.fieldType === 'number'){
                inputType="text";
			}
			
			template = currencyTitle + '<input type="' + inputType + '" class="' + this.class + '" '+
				'ng-model="swInput.value" '+
				'ng-disabled="swInput.editable === false" '+
				'ng-show="swInput.edit" '+
				`ng-class="{'form-control':swInput.inListingDisplay, 'input-xs':swInput.inListingDisplay}"` +
				'name="'+this.propertyIdentifier+'" ' +
				'placeholder="'+placeholder+'" '+
				validations + currencyFormatter +
				'id="swinput'+this.swForm.name+this.name+'" '+
				'style="'+style+'"'+
				this.inputAttributes+
				this.eventAnnouncerTemplate;
		}

		var dateFieldTypes = ['date','datetime','time'];
		if(dateFieldTypes.indexOf(this.fieldType.toLowerCase()) >= 0){
			template = template + 'datetime-picker ';
		}
		if(this.fieldType === 'time'){
			template = template + 'data-time-only="true" date-format="'+appConfig.timeFormat.replace('tt','a')+'" ng-blur="swInput.pushBindings()"';
		}
		if(this.fieldType === 'date'){
			template = template + 'data-date-only="true" future-only date-format="'+appConfig.dateFormat+'" ';
		}
		if(template.length){
			template = template + ' />';
		}

		var actionButtons = `
			<a class="s-remove-change"
				data-ng-click="swPropertyDisplay.clear()"
				data-ng-if="swInput.edited && swInput.edit">
					<i class="fa fa-remove"></i>
			</a>

			<!-- Revert Button -->
			<button class="btn btn-xs btn-default s-revert-btn"
					data-ng-show="swInput.showRevert"
					data-ng-click="swInput.revert()"
					data-toggle="popover"
					data-trigger="hover"
					data-content="{{swInput.revertText}}"
					data-original-title=""
					title="">
				<i class="fa fa-refresh"></i>
			</button>
		`;

        console.log(template + actionButtons);
        debugger;
		return template + actionButtons;
	};

    public pullBindings = ()=>{
        debugger;
		var bindToControllerProps = this.$injector.get('swInputDirective')[0].bindToController;
		for(var i in bindToControllerProps){
			if(!this[i]){
				if(!this[i] && this.swFormField && this.swFormField[i]){
					this[i] = this.swFormField[i];
                    //debugger;
				}else if(!this[i] && this.swPropertyDisplay && this.swPropertyDisplay[i]){
					this[i] = this.swPropertyDisplay[i];
                    //debugger;
				}else if(!this[i] && this.swfPropertyDisplay && this.swfPropertyDisplay[i]){
					this[i] = this.swfPropertyDisplay[i];
                    //debugger;
				}else if(!this[i] && this.swForm && this.swForm[i]){
					this[i] = this.swForm[i];
                    //debugger;
				}
			}
		}

		this.edit = this.edit || true;
		this.fieldType = this.fieldType || "text";

		this.inputAttributes = this.inputAttributes || "";

		this.inputAttributes = this.utilityService.replaceAll(this.inputAttributes,"'",'"');

		this.value = this.utilityService.getPropertyValue(this.object,this.propertyIdentifier);
    }

    public pushBindings = ()=>{
        this.observerService.notify('updateBindings').then(()=>{});    
    }

	public $onInit = ()=>{

        this.pullBindings();

		this.eventAnnouncersArray = <Array<EventAnnouncer>>this.eventAnnouncers.split(',');

        debugger;
		this.eventAnnouncerTemplate = "";
		for(var i in this.eventAnnouncersArray){
			var eventName = this.eventAnnouncersArray[i];
            if(eventName.length){
                this.eventAnnouncerTemplate += ` ng-`+eventName+`="swInput.onEvent($event,'`+eventName+`')"`;
            }
		}

		if (this.object && this.object.metaData && this.object.metaData.className != undefined){
 			this.eventNameForObjectSuccess = this.object.metaData.className.split('_')[0]+this.context.charAt(0).toUpperCase()+this.context.slice(1)+'Success'
 		}else{
 			this.eventNameForObjectSuccess = this.context.charAt(0).toUpperCase()+this.context.slice(1)+'Success'
 		}
		var eventNameForObjectSuccessID = this.eventNameForObjectSuccess+this.propertyIdentifier;

		var eventNameForUpdateBindings = 'updateBindings';
		if (this.object && this.object.metaData && this.object.metaData.className != undefined){
 			var eventNameForUpdateBindingsID = this.object.metaData.className.split('_')[0]+this.propertyIdentifier+'updateBindings';
 		}else{
 			var eventNameForUpdateBindingsID = this.propertyIdentifier+'updateBindings';
 		}
        var eventNameForPullBindings = 'pullBindings';
        if (this.object && this.object.metaData && this.object.metaData.className != undefined){
         	var eventNameForPullBindingsID = this.object.metaData.className.split('_')[0]+this.propertyIdentifier+'pullBindings';
		}else{
 			var eventNameForPullBindingsID = this.propertyIdentifier+'pullBindings';

 		}
		//attach a successObserver
		if(this.object){
			//update bindings on save success
			this.observerService.attach(this.onSuccess,this.eventNameForObjectSuccess,eventNameForObjectSuccessID);

			//update bindings manually
			this.observerService.attach(this.onSuccess,eventNameForUpdateBindings,eventNameForUpdateBindingsID);

            //pull bindings from higher binding level manually
            this.observerService.attach(this.pullBindings,eventNameForPullBindings,eventNameForPullBindingsID);

		}

		this.$scope.$on("$destroy",()=>{
			this.observerService.detachById(eventNameForUpdateBindings);
			this.observerService.detachById(eventNameForUpdateBindingsID )
		})
	}
}

class SWInput{

	public restrict = "E";
	public require = {
		swForm:"?^swForm",
		form:"?^form",
		swFormField:"?^swFormField",
		swPropertyDisplay:"?^swPropertyDisplay",
		swfPropertyDisplay:"?^swfPropertyDisplay"
	};

	public scope={};
	public propertyDisplay;

	public bindToController = {
		propertyIdentifier: "@?",
		name : "@?",
		class: "@?",
		errorClass: "@?",
		option: "=?",
		valueObject: "=?",
		object: "=?",
		label: 	"@?",
		labelText: "@?",
		labelClass: "@?",
		inListingDisplay: "=?",
		listingID: "=?",
		pageRecordIndex: "=?",
	    propertyDisplayID: "=?",
		initialValue:"=?",
		optionValues: "=?",
		edit: 	"=?",
		title: 	"@?",
		value: 	"=?",
		errorText: "@?",
		fieldType: "@?",
		property:"@?",
		binaryFileTarget:"@?",
		rawFileTarget:"@?",
		reverted:"=?",
		revertToValue:"=?",
		showRevert:"=?",
		inputAttributes:"@?",
		type:"@?",
		eventAnnouncers:"@?",
		context:"@?"
	}
	public controller=SWInputController;
	public controllerAs = "swInput";

	//ngInject
	constructor(
		public $compile,
		public $timeout,
		public $parse,
		public fileService
	){
	}

	public link:ng.IDirectiveLinkFn = (scope:any,element:any,attr)=>{
        debugger;

		if(scope.swInput.type === 'file'){

			if(angular.isUndefined(scope.swInput.object.data[scope.swInput.rawFileTarget])){
				scope.swInput.object[scope.swInput.rawFileTarget] = "";
				scope.swInput.object.data[scope.swInput.rawFileTarget] = "";
			}
			var model = this.$parse("swInput.object.data[swInput.rawFileTarget]");
			var modelSetter = model.assign;
			element.bind("change", (e)=>{

				var fileToUpload = (e.srcElement || e.target).files[0];

				scope.$apply(
					()=>{
						modelSetter(scope, fileToUpload);
					},
					()=>{
						throw("swinput couldn't apply the file to scope");
					}
				);

				this.$timeout(()=>{

					this.fileService.uploadFile(fileToUpload, scope.swInput.object, scope.swInput.binaryFileTarget)
					.then(
						(result)=>{
							scope.swInput.object[scope.swInput.property] = fileToUpload;
							scope.swInput.onEvent(e, "change");
						},
						()=>{
							//error	notify user
						}
					);
				});
			});
		}

		//renders the template and compiles it
		element.html(scope.swInput.getTemplate());
		this.$compile(element.contents())(scope);

	}

	public static Factory(){
		var directive = (
			$compile,
			$timeout,
			$parse,
			fileService
		)=>new SWInput(
			$compile,
			$timeout,
			$parse,
			fileService
		);
		directive.$inject = [
			'$compile',
			'$timeout',
			'$parse',
			'fileService'
		];
		return directive
	}
}
export{
	SWInput
}


import { Component, OnInit, OnDestroy, Inject, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { UtilityService } from '../../core/services/utilityservice';
import { $Hibachi } from '../../core/services/hibachiservice';
import { RbKeyService } from '../../core/services/rbkeyservice';
import { ListingService } from '../../listing/services/listingservice';
import { FormControl, Validators } from '@angular/forms';
//import { ObserverService } from '../../core/services/observerservice';

@Component({
    selector   : 'sw-input-upgraded',
    //template   : `<div class="one"  #one></div>`
    templateUrl: '/org/Hibachi/client/src/form/components/input.html'    
})
export class SwInput implements OnInit, OnDestroy {
           
    @Input() propertyIdentifier;
    @Input() name;
    @Input() class;
    errorClass;
    option;
    valueObject;
    @Input() object;
    @Input() label;
    @Input() labelText;
    labelClass;
    inListingDisplay;
    listingID;
    pageRecordIndex;
    @Input() propertyDisplayID;
    initialValue;
    optionValues;
    @Input() edit;
    @Input() title;
    value;
    errorText;
    @Input() fieldType;
    property;
    binaryFileTarget;
    rawFileTarget;
    reverted;
    revertToValue;
    showRevert;
    inputAttributes;
    type;
    eventAnnouncers;
    @Input() context;
    
    public form;
    public edited;
    public rowSaveEnabled;
    public eventAnnouncersArray:Array<EventAnnouncer>;
    public eventAnnouncerTemplate:string;
    public eventNameForObjectSuccess:string;
    public eventNameForUpdateBindings;
    public eventNameForUpdateBindingsID;
    
    control: FormControl;
    
    constructor(
        @Inject(DOCUMENT) private document: any,
        private utilityService: UtilityService,
        private observerService: ObserverService,
        private $hibachi: $Hibachi,
        private rbKeyService: RbKeyService,
        private listingService: ListingService,
        private elementRef:ElementRef
    ) {
        //this.control = new FormControl('', [Validators.required]);
    }
    
    
//    ngAfterViewInit() {
//        var d1 = this.elementRef.nativeElement.querySelector('.one');
//        d1.insertAdjacentHTML('beforeend', this.getTemplate());
//    }

    ngOnInit() {
        if(!this.class){
            this.class = "form-control";
        }
        
        if(this.inListingDisplay === undefined) {
            this.inListingDisplay = true;    
        }
        
        this.pullBindings();
//        this.eventAnnouncersArray = <Array<EventAnnouncer>>this.eventAnnouncers.split(',');

        this.eventAnnouncerTemplate = "";
//        for(var i in this.eventAnnouncersArray){
//            var eventName = this.eventAnnouncersArray[i];
//            if(eventName.length){
//                this.eventAnnouncerTemplate += ` ng-`+eventName+`="swInput.onEvent($event,'`+eventName+`')"`;
//            }
//        }

        if (this.object && this.object.metaData && this.object.metaData.className != undefined){
            this.eventNameForObjectSuccess = this.object.metaData.className.split('_')[0]+this.context.charAt(0).toUpperCase()+this.context.slice(1)+'Success'
        }else{
            this.eventNameForObjectSuccess = this.context.charAt(0).toUpperCase()+this.context.slice(1)+'Success'
        }
        var eventNameForObjectSuccessID = this.eventNameForObjectSuccess+this.propertyIdentifier;

        this.eventNameForUpdateBindings = 'updateBindings';
        if (this.object && this.object.metaData && this.object.metaData.className != undefined){
            this.eventNameForUpdateBindingsID = this.object.metaData.className.split('_')[0]+this.propertyIdentifier+'updateBindings';
        }else{
            this.eventNameForUpdateBindingsID = this.propertyIdentifier+'updateBindings';
        }
        var eventNameForPullBindings = 'pullBindings';
        if (this.object && this.object.metaData && this.object.metaData.className != undefined){
            var eventNameForPullBindingsID = this.object.metaData.className.split('_')[0]+this.propertyIdentifier+'pullBindings';
        }else{
            var eventNameForPullBindingsID = this.propertyIdentifier+'pullBindings';

        }
        //attach a successObserver
        if(this.object){
            //update bindings on save success
            this.observerService.attach(this.onSuccess,this.eventNameForObjectSuccess,eventNameForObjectSuccessID);

            //update bindings manually
            this.observerService.attach(this.onSuccess,this.eventNameForUpdateBindings,this.eventNameForUpdateBindingsID);

            //pull bindings from higher binding level manually
            this.observerService.attach(this.pullBindings,eventNameForPullBindings,eventNameForPullBindingsID);

        }
        
        //renders the template and compiles it
        //this.document.body.innerHTML.append = this.document.body.innerHTML + this.getTemplate(); 
        //element.html(scope.swInput.getTemplate());
        //this.$compile(element.contents())(scope);

    }
    
    pullBindings = ()=>{
        debugger;
        //var bindToControllerProps = this.$injector.get('swInputDirective')[0].bindToController;
//        for(var i in bindToControllerProps){
//            if(!this[i]){
//                if(!this[i] && this.swFormField && this.swFormField[i]){
//                    this[i] = this.swFormField[i];
//                    //debugger;
//                }else if(!this[i] && this.swPropertyDisplay && this.swPropertyDisplay[i]){
//                    this[i] = this.swPropertyDisplay[i];
//                   // debugger;
//                }else if(!this[i] && this.swfPropertyDisplay && this.swfPropertyDisplay[i]){
//                    this[i] = this.swfPropertyDisplay[i];
//                    //debugger;
//                }else if(!this[i] && this.swForm && this.swForm[i]){
//                    this[i] = this.swForm[i];
//                    debugger;
//                }
//            }
//        }

        this.edit = this.edit || true;
        this.fieldType = this.fieldType || "text";

        this.inputAttributes = this.inputAttributes || "";

        this.inputAttributes = this.utilityService.replaceAll(this.inputAttributes,"'",'"');

        this.value = this.utilityService.getPropertyValue(this.object,this.propertyIdentifier);
        debugger;
    };

    onSuccess = ()=>{
//        this.utilityService.setPropertyValue(this.swForm.object,this.propertyIdentifier,this.value);
//        if(this.swPropertyDisplay){
//            this.utilityService.setPropertyValue(this.swPropertyDisplay.object,this.propertyIdentifier,this.value);
//        }
//        if(this.swfPropertyDisplay){
//            this.utilityService.setPropertyValue(this.swfPropertyDisplay.object,this.propertyIdentifier,this.value);
//            this.swfPropertyDisplay.edit = false;
//        }
//        this.utilityService.setPropertyValue(this.swFormField.object,this.propertyIdentifier,this.value);
    };
    
    getTemplate = ()=>{
        debugger;
        var template = '';
        var validations = '';
        var currencyTitle = '';
        var currencyFormatter = '';
        var style = "";

        if(!this.class){
            this.class = "form-control";
        }

//        if(!this.noValidate){
//            validations = this.getValidationDirectives();
//        }

        if(this.object && this.object.metaData && this.object.metaData.$$getPropertyFormatType(this.propertyIdentifier) != undefined && this.object.metaData.$$getPropertyFormatType(this.propertyIdentifier) == "currency"){
            currencyFormatter = 'sw-currency-formatter ';
            if(angular.isDefined(this.object.data.currencyCode)){
                currencyFormatter = currencyFormatter + 'data-currency-code="' + this.object.data.currencyCode + '" ';
                currencyTitle = '<span class="s-title">' + this.object.data.currencyCode + '</span>';
            }
        }

        var appConfig = this.$hibachi.getConfig();

        var placeholder ='';
        if(this.object.metaData && this.object.metaData[this.propertyIdentifier] && this.object.metaData[this.propertyIdentifier].hb_nullrbkey){
            placeholder = this.rbKeyService.getRBKey(this.object.metaData[this.propertyIdentifier].hb_nullrbkey);
        }

        if(this.fieldType.toLowerCase() === 'json'){
            style = style += 'display:none';
        }

        var acceptedFieldTypes = ['email','text','password','number','time','date','datetime','json','file'];

        if(acceptedFieldTypes.indexOf(this.fieldType.toLowerCase()) >= 0){
            var inputType = this.fieldType.toLowerCase();
            
            if(this.fieldType === 'time' || this.fieldType === 'number'){
                inputType="text";
            }
            
            template = currencyTitle + '<input type="' + inputType + '" class="' + this.class + '" '+
                '[(ngModel)]="value" '+
                '[disabled]="editable === false" '+
                '[hidden]="!edit" '+
                `[ngClass]="{'form-control':swInput.inListingDisplay, 'input-xs':swInput.inListingDisplay}"` +
                'name="'+this.propertyIdentifier+'" ' +
                'placeholder="'+placeholder+'" '+
                validations + currencyFormatter +
                'id="swinput'+this.name+'" '+
                'style="'+style+'"'+
                this.inputAttributes+
                this.eventAnnouncerTemplate;
        }

//        var dateFieldTypes = ['date','datetime','time'];
//        if(dateFieldTypes.indexOf(this.fieldType.toLowerCase()) >= 0){
//            template = template + 'datetime-picker ';
//        }
//        if(this.fieldType === 'time'){
//            template = template + 'data-time-only="true" date-format="'+appConfig.timeFormat.replace('tt','a')+'" ng-blur="swInput.pushBindings()"';
//        }
//        if(this.fieldType === 'date'){
//            template = template + 'data-date-only="true" future-only date-format="'+appConfig.dateFormat+'" ';
//        }
//        if(template.length){
//            template = template + ' />';
//        }

        var actionButtons = `
            <a class="s-remove-change"
                (click)="clear()"
                *ngIf="this.edited && this.edit">
                    <i class="fa fa-remove"></i>
            </a>

            <!-- Revert Button -->
            <button class="btn btn-xs btn-default s-revert-btn"
                    [hidden]="!showRevert"
                    (click)="revert()"
                    [data-toggle]="'popover'"
                    [data-trigger]="'hover'"
                    [data-content]="{{revertText}}"
                    [data-original-title]=""
                    title="">
                <i class="fa fa-refresh"></i>
            </button>
        `;

        console.log(template + actionButtons);
        debugger;
        return template + actionButtons;
    };

    clear = () =>{
        if(this.reverted){
            this.reverted = false;
            this.showRevert = true;
        }
        this.edited = false;
        this.value= this.initialValue;
        if(this.inListingDisplay && this.rowSaveEnabled){
            this.listingService.markUnedited( this.listingID,
                                              this.pageRecordIndex,
                                              this.propertyDisplayID
                                            );
        }
    };
    
    revert = () =>{
        this.showRevert = false;
        this.reverted = true;
        this.value = this.revertToValue;
        this.onEvent(<Event>{}, "change");
    };
    
    onEvent = (event:Event,eventName:string):void=>{
        let customEventName = this.name+eventName;
        let formEventName = this.name + eventName;
        let data = {
            event:event,
            eventName:eventName,
            form:this.form,
            //swForm:this.swForm,
            swInput:this,
            inputElement:$('input').first()[0]
        };
        this.observerService.notify(customEventName,data);
        this.observerService.notify(formEventName,data);
        this.observerService.notify(eventName,data);
    };
    
    ngOnDestroy() {
        this.observerService.detachById(this.eventNameForUpdateBindings);
        this.observerService.detachById(this.eventNameForUpdateBindingsID );        
    }
}