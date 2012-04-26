/*

    Slatwall - An e-commerce plugin for Mura CMS
    Copyright (C) 2011 ten24, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    Linking this library statically or dynamically with other modules is
    making a combined work based on this library.  Thus, the terms and
    conditions of the GNU General Public License cover the whole
    combination.
 
    As a special exception, the copyright holders of this library give you
    permission to link this library with independent modules to produce an
    executable, regardless of the license terms of these independent
    modules, and to copy and distribute the resulting executable under
    terms of your choice, provided that you also meet, for each linked
    independent module, the terms and conditions of the license of that
    module.  An independent module is a module which is not derived from
    or based on this library.  If you modify this library, you may extend
    this exception to your version of the library, but you are not
    obligated to do so.  If you do not wish to do so, delete this
    exception statement from your version.

Notes:

*/
component displayname="Price Group Rate" entityname="SlatwallPriceGroupRate" table="SlatwallPriceGroupRate" persistent=true output=false accessors=true extends="BaseEntity" {
	
	// Persistent Properties
	property name="priceGroupRateID" ormtype="string" length="32" fieldtype="id" generator="uuid" unsavedvalue="" default="";
	property name="globalFlag" ormType="boolean" default="false";
	property name="amount" ormType="big_decimal" formatType="custom";
	property name="amountType" ormType="string" formFieldType="select";
	property name="percentageOff" ormType="big_decimal"; //to be removed
	property name="amountOff" ormType="big_decimal"; //to be removed
	
	// Remote properties
	property name="remoteID" ormtype="string";
	
	// Audit properties
	property name="createdDateTime" ormtype="timestamp";
	property name="createdByAccount" cfc="Account" fieldtype="many-to-one" fkcolumn="createdByAccountID";
	property name="modifiedDateTime" ormtype="timestamp";
	property name="modifiedByAccount" cfc="Account" fieldtype="many-to-one" fkcolumn="modifiedByAccountID";
		
	// Related Object Properties (many-to-one)
	property name="priceGroup" cfc="PriceGroup" fieldtype="many-to-one" fkcolumn="priceGroupID";
	property name="roundingRule" cfc="RoundingRule" fieldtype="many-to-one" fkcolumn="roundingRuleID";
	
	// Related Object Properties (many-to-many)
	property name="productTypes" singularname="productType" cfc="ProductType" fieldtype="many-to-many" linktable="SlatwallPriceGroupRateProductType" fkcolumn="priceGroupRateID" inversejoincolumn="productTypeID";
	property name="products" singularname="product" cfc="Product" fieldtype="many-to-many" linktable="SlatwallPriceGroupRateProduct" fkcolumn="priceGroupRateID" inversejoincolumn="productID";
	property name="skus" singularname="sku" cfc="Sku" fieldtype="many-to-many" linktable="SlatwallPriceGroupRateSku" fkcolumn="priceGroupRateID" inversejoincolumn="skuID";
	property name="excludedProductTypes" singularname="excludedProductType" cfc="ProductType" fieldtype="many-to-many" linktable="SlatwallPriceGroupRateExcludedProductType" fkcolumn="priceGroupRateID" inversejoincolumn="productTypeID";
	property name="excludedProducts" singularname="excludedProduct" cfc="Product" fieldtype="many-to-many" linktable="SlatwallPriceGroupRateExcludedProduct" fkcolumn="priceGroupRateID" inversejoincolumn="productID";
	property name="excludedSkus" singularname="excludedSku" cfc="Sku" fieldtype="many-to-many" linktable="SlatwallPriceGroupRateExcludedSku" fkcolumn="priceGroupRateID" inversejoincolumn="skuID";
	
	// Non-persistent entities
	property name="amountTypeOptions" persistent="false";
	property name="appliesTo" type="string" persistent="false";
	
	public PriceGroupRate function init() {
	   // set default collections for association management methods
	   if(isNull(variables.productTypes)) {
	   	   variables.productTypes = [];
	   }
	   if(isNull(variables.products)) {
	   	   variables.products = [];
	   }
	   if(isNull(variables.Skus)) {
	   	   variables.Skus = [];
	   }
	   if(isNull(variables.excludedProductTypes)) {
	   	   variables.excludedProductTypes = [];
	   }
	   if(isNull(variables.excludedProducts)) {
	   	   variables.excludedProducts = [];
	   }
	   if(isNull(variables.excludedSkus)) {
	   	   variables.excludedSkus = [];
	   }
	   
	   return super.init();
	}
 

	// ============ START: Non-Persistent Property Methods =================
	
	public array function getAmountTypeOptions() {
		return [
			{name=rbKey("define.amountOff"), value="amountOff"},
			{name=rbKey("define.percentageOff"), value="percentageOff"},
			{name=rbKey("define.fixedAmount"), value="amount"}
		];
	}

    public string function getAppliesTo(){
    	var including = "";
    	var excluding = "";
    	var finalString = "";
    	var productsList = "";
    	var productTypesList = "";
    	var skusList = "";
    	var excludedProductsList = "";
    	var excludedProductTypesList = "";
    	var excludedSkusList = "";
    	
    	if(getGlobalFlag()) {
    		return rbKey('admin.pricegroup.edit.priceGroupRateAppliesToAllProducts');
    	}
    	
    	// --------- Including --------- 
    	if(arrayLen(getProducts())) {
    		productsList = "#arrayLen(getProducts())# Product" & IIF(arrayLen(getProducts()) GT 1, DE('s'), DE(''));
    	}
    	if(arrayLen(getProductTypes())) {
    		productTypesList = "#arrayLen(getProductTypes())# Product Type" & IIF(arrayLen(getProductTypes()) GT 1, DE('s'), DE(''));
    	}
    	if(arrayLen(getSkus())) {
    		SkusList = "#arrayLen(getSkus())# SKU" & IIF(arrayLen(getSkus()) GT 1, DE('s'), DE(''));
    	}
    	if(ListLen(productsList)) {
    		including = ListAppend(including, productsList);
    	}
    	if(ListLen(productTypesList)) {
    		including = ListAppend(including, productTypesList);
    	} 
    	if(ListLen(SkusList)) {
    		including = ListAppend(including, SkusList);
    	}
    		
    	// Replace all commas with " and ".
    	if(listLen(including)) {
    		including = Replace(including, ",", " and ");
    	}
    		
    	// --------- Excluding --------- 	
   		if(arrayLen(getExcludedProducts())) {
    		excludedProductsList = "#arrayLen(getExcludedProducts())# Product" & IIF(arrayLen(getExcludedProducts()) GT 1, DE('s'), DE(''));
    	}
    	if(arrayLen(getExcludedProductTypes())) {
    		excludedProductTypesList = "#arrayLen(getExcludedProductTypes())# Product Type" & IIF(arrayLen(getExcludedProductTypes()) GT 1, DE('s'), DE(''));
    	}
    	if(arrayLen(getExcludedSkus())) {
    		excludedSkusList = "#arrayLen(getExcludedSkus())# SKU" & IIF(arrayLen(getExcludedSkus()) GT 1, DE('s'), DE(''));
    	}
    	
    	if(ListLen(excludedProductsList)) { 
    		excluding = ListAppend(excluding, excludedProductsList);
    	}
    	if(ListLen(excludedproductTypesList)) {
    		excluding = ListAppend(excluding, excludedProductTypesList);
    	} 
    	if(ListLen(excludedSkusList)) {
    		excluding = ListAppend(excluding, excludedSkusList);
    	}
    		
    	// Replace all commas with " and ".
    	if(listLen(excluding)) {
    		excluding = Replace(excluding, ",", " and ");
    	}
    		
		// Assemble Including and Excluding strings
    	if(len(including)) {
    		finalString = "Including: " & including;
    	}
    		
    	if(len(excluding)) {
    		if(len(including)) {
    			finalString &= ". ";
    		}
    		finalString &= "Excluding: " & excluding;
    	}
    		
    	return finalString;
    }
    
	// ============  END:  Non-Persistent Property Methods =================
		
	// ============= START: Bidirectional Helper Methods ===================
	
	// Price Group (many-to-one)
	public void function setPriceGroup(required any priceGroup) {
	   variables.priceGroup = arguments.priceGroup;
	   if(isNew() or !arguments.priceGroup.hasPriceGroupRate(this)) {
	       arrayAppend(arguments.priceGroup.getPriceGroupRates(),this);
	   }
	}
	
	public void function removePriceGroup() {
       var index = arrayFind(variables.priceGroup.getPriceGroupRates(),this);
       if(index > 0) {
           arrayDeleteAt(variables.priceGroup.getPriceGroupRates(),index);
       }
       structDelete(variables,"priceGroup");
    }
    
	// Products (many-to-many)	
	public void function addProduct(required any product) {
		if(arguments.product.isNew() || !hasProduct(arguments.product)) {
			// first add product to this priceGroup
			arrayAppend(this.getProducts(),arguments.product);
			//add this priceGroupRate to the product
			arrayAppend(arguments.product.getPriceGroupRates(),this);
		}
	}
    
    public void function removeProduct(required any product) {
       // first remove the product from this priceGroupRate
       if(this.hasProduct(arguments.product)) {
	       var index = arrayFind(this.getProducts(),arguments.product);
	       if(index>0) {
	           arrayDeleteAt(this.getProducts(),index);
	       }
	      // then remove this priceGroupRate from the product
	       var index = arrayFind(arguments.product.getPriceGroups(),this);
	       if(index > 0) {
	           arrayDeleteAt(arguments.product.getPriceGroups(),index);
	       }
	   }
    }
    
	// ProductTypes (many-to-many)	
	public void function addProductType(required any productType) {
		if(arguments.productType.isNew() || !hasProductType(arguments.productType)) {
			// first add productType to this priceGroupRate
			arrayAppend(this.getProductTypes(),arguments.productType);
			//add this priceGroupRate to the productType
			arrayAppend(arguments.productType.getPriceGroupRates(),this);
		}
	}
    
    public void function removeProductType(required any productType) {
       // first remove the productType from this priceGroupRate
       if(this.hasProductType(arguments.productType)) {
	       var index = arrayFind(this.getProductTypes(),arguments.productType);
	       if(index>0) {
	           arrayDeleteAt(this.getProductTypes(),index);
	       }
	      // then remove this priceGroupRate from the ProductType
	       var index = arrayFind(arguments.productType.getPriceGroups(),this);
	       if(index > 0) {
	           arrayDeleteAt(arguments.productType.getPriceGroups(),index);
	       }
	   }
    }
	
    // =============  END:  Bidirectional Helper Methods ===================
	
	// ================== START: Overridden Methods ========================
	
	public string function getAmountFormatted() {
		if(getAmountType() == "percentageOff") {
			return getAmount() & "%";
		} else {
			return formatValue(getAmount(),"currency");
		}
	}

	public string function getSimpleRepresentationPropertyName() {
		return "appliesTo";
	}

	// ==================  END:  Overridden Methods ========================
	
	// =================== START: ORM Event Hooks  =========================
	
	// ===================  END:  ORM Event Hooks  =========================
}
