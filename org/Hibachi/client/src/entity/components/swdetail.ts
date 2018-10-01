/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />
class SWDetail{
	public static Factory(){
		var directive = (
			$location,
			$log,
			$hibachi,
			coreEntityPartialsPath,
			hibachiPathBuilder
		)=> new SWDetail(
			$location,
			$log,
			$hibachi,
			coreEntityPartialsPath,
			hibachiPathBuilder
		);
		directive.$inject = [
			'$location',
			'$log',
			'$hibachi',
			'coreEntityPartialsPath',
			'hibachiPathBuilder'
		];
		return directive;
	}
	constructor(
		$location,
		$log,
		$hibachi,
		coreEntityPartialsPath,
		hibachiPathBuilder
	){
        //debugger;
		return {
	        restrict: 'E',
	        templateUrl:hibachiPathBuilder.buildPartialsPath(coreEntityPartialsPath)+'/detail.html',
	        link: function (scope, element, attr) {
	        	scope.$id="slatwallDetailController";
	        	$log.debug('slatwallDetailController');
                console.log("sw-detail component");
				/*Sets the view dirty on save*/
				scope.setDirty = function(entity){
                    console.log("entity",entity);
					angular.forEach(entity.forms,function(form){
						form.$setSubmitted();
					});
				};
	        	var setupMetaData = function(){
                    console.log("setupMetaData function");
                    console.log(scope.entity);
                    console.log(scope.entityName.toLowerCase());
	        		scope[scope.entityName.toLowerCase()] = scope.entity;
                    //debugger;
                    
	        		scope.entity.metaData.$$getDetailTabs().then(function(value){
                        scope.detailTabs = value.data;
                        //debugger;
                        $log.debug('detailtabs');
                        $log.debug(scope.detailTabs);
                        console.log(scope.detailTabs);
                        //debugger;
                    });


	        	};

	        	var propertyCasedEntityName = scope.entityName.charAt(0).toUpperCase() + scope.entityName.slice(1);

	        	scope.tabPartialPath = hibachiPathBuilder.buildPartialsPath(coreEntityPartialsPath);
                console.log(scope.tabPartialPath);
                //debugger;

	        	scope.getEntity = function(){
                    //debugger;
	        		if(scope.entityID === 'create'){
                        scope.createMode = true;
	        			scope.entity = $hibachi['new'+propertyCasedEntityName]();
                        //debugger;
	        			setupMetaData();
	        		}else{
                        scope.createMode = false;
	        			var entityPromise = $hibachi['get'+propertyCasedEntityName]({id:scope.entityID});
                        //debugger;
	        			entityPromise.promise.then(function(){
	        				scope.entity = entityPromise.value;
                            //debugger;
	        				setupMetaData();
	        			});
	        		}

	        	};
	        	scope.getEntity();
	        	scope.deleteEntity = function(){
                    //debugger;
	        		var deletePromise = scope.entity.$$delete();
	        		deletePromise.then(function(){
                        //debugger;
	        			$location.path( '/entity/'+propertyCasedEntityName+'/' );
	        		});
	        	};
	        	scope.allTabsOpen = false;
	        }
	    };
	}
}
export{
	SWDetail
}

import { Component,Input,OnInit,Inject } from '@angular/core';
import { $Hibachi } from '../../core/services/hibachiservice';
import { HibachiPathBuilder } from '../../core/services/hibachipathbuilder';
import {AppConfig} from "../../../../../../admin/client/src/app.provider";

@Component({
    selector: 'sw-detail',
    templateUrl: "/org/Hibachi/client/src/entity/components/detail.html"
})
export class SwDetail implements OnInit {
    private $id: string = 'slatwallDetailController';
    private entityName: string;
    private propertyCasedEntityName:string; // = scope.entityName.charAt(0).toUpperCase() + scope.entityName.slice(1);
    private tabPartialPath:string;
    private entityID:string;
    private allTabsOpen: boolean;
    private detailTabs: any;
    private openTab: any;
    
    constructor(
        private $hibachi: $Hibachi,
        private hibachiPathBuilder: HibachiPathBuilder,
        @Inject('$routeParams') private $routeParams: any,
        @Inject('CoreEntityPartialsPath') private coreEntityPartialsPath: any,
        private appConfig: AppConfig
    ){
        console.log(this.$routeParams);
        this.entityName = this.$routeParams.entityName;
        this.entityID = this.$routeParams.entityID;
        this.propertyCasedEntityName = this.entityName.charAt(0).toUpperCase() + this.entityName.slice(1);
        this.hibachiPathBuilder.setBaseURL(this.appConfig.baseURL);
        this.tabPartialPath = this.hibachiPathBuilder.buildPartialsPath(coreEntityPartialsPath);
        this.getEntity();
        
    }    
    
    ngOnInit() {
        this.allTabsOpen = false;
        this.openTab = false;
        
    }

    /*Sets the view dirty on save*/
    private setDirty = function(entity) {
        console.log("entity",entity);
        angular.forEach(entity.forms,function(form){
            form.$setSubmitted();
        });
    };
    
    private getEntity = function() {
        if (this.entityID === 'create') {
            this.createMode = true;
            this.entity = this.$hibachi['new' + this.propertyCasedEntityName]();
            this.setupMetaData();
        } else {
            this.createMode = false;
            let entityPromise = this.$hibachi['get' + this.propertyCasedEntityName]({ id: this.entityID });
            entityPromise.promise.then(() => {
                this.entity = entityPromise.value;
                this.setupMetaData();
            });
        }
    };
    
    private setupMetaData = function() {
        console.log("setupMetaData function");
        console.log(this.entity);
        console.log(this.entityName.toLowerCase());
        this[this.entityName.toLowerCase()] = this.entity;
        this.entity.metaData.$$getDetailTabs().then((value) => {
            this.detailTabs = value.data;
            console.log(this.detailTabs);
            console.log(this);
            //debugger;
        });
    };
        
}