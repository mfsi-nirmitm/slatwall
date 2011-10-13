<!---

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

--->
<cfparam name="rc.orderReport" type="any">

<cfoutput>
	<div class="svoadminreportorder">
		<script type="text/javascript">
			var reportRevenueClosed = [
				<cfloop query="rc.orderReport">
					[Date.UTC(#rc.orderReport.Year#,#rc.orderReport.Month#,#rc.orderReport.Day#),#rc.orderReport.SubtotalBeforeDiscounts#]<cfif rc.orderReport.currentRow neq rc.orderReport.recordCount>,</cfif></cfloop>
			]
		</script>
		<div id="container" style="height: 500px"></div>
		<table class="mura-table-grid stripe">
			<tr>
				<th>Day</th>
				<th>Discounts</th>
				<th>Tax</th>
				<th>Subtotal Before Discounts</th>
			</tr>
			
			<cfset subTotal = 0 />
			<cfset taxTotal = 0 />
			<cfloop query="rc.orderReport">
				<cfset subTotal += rc.orderReport.SubtotalBeforeDiscounts />
				<cfif isNumeric(rc.orderReport.TotalTax)>
					<cfset taxTotal += rc.orderReport.TotalTax />
				</cfif>
				<tr>
					<td>#rc.orderReport.Year#-#rc.orderReport.Month#-#rc.orderReport.Day#</td>
					<td>#dollarFormat(0)#</td>
					<td>#dollarFormat(rc.orderReport.TotalTax)#</td>
					<td>#dollarFormat(rc.orderReport.SubtotalBeforeDiscounts)#</td>
				</tr>
			</cfloop>
			<tr>
				<td><strong>Totals</strong></td>
				<td><strong>#dollarFormat(0)#</strong></td>
				<td><strong>#dollarFormat(taxTotal)#</strong></td>
				<td><strong>#dollarFormat(subTotal)#</strong></td>
			</tr>
		</table>
	</div>
</cfoutput>