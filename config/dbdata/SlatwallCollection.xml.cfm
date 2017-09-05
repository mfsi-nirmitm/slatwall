<?xml version="1.0" encoding="UTF-8"?>
<Table tableName="SwCollection">
    <Columns>
        <column name="collectionID" fieldtype="id" />
        <column name="collectionName" update="false" />
        <column name="collectionCode" />
        <column name="collectionDescription" update="false"/>
        <column name="collectionObject" />
        <column name="collectionConfig" />
    </Columns>
    <Records>
        <Record collectionID="db4327e506000fde08cc4855fa14448b" collectionName="Slatwall Queue" collectionCode="QUEUE" collectionDescription="Slatwall queue collection used in workflow" collectionObject="EntityQueue" collectionConfig='{"baseEntityAlias":"_entityqueue","baseEntityName":"EntityQueue","columns":[{"isDeletable":false,"isExportable":true,"propertyIdentifier":"_entityqueue.entityQueueID","ormtype":"id","isVisible":false,"isSearchable":true,"title":"Entity Queue ID","sorting":{"active":false,"sortOrder":"asc","priority":0},"key":"entityQueueID"},{"isDeletable":true,"isExportable":true,"propertyIdentifier":"_entityqueue.baseObject","ormtype":"string","isVisible":true,"isSearchable":true,"title":"Base Object","sorting":{"active":false,"sortOrder":"asc","priority":0},"key":"baseObject"},{"isDeletable":true,"isExportable":true,"propertyIdentifier":"_entityqueue.baseID","ormtype":"string","isVisible":true,"isSearchable":true,"title":"Base ID","sorting":{"active":false,"sortOrder":"asc","priority":0},"key":"baseID"},{"isDeletable":true,"isExportable":true,"propertyIdentifier":"_entityqueue.processMethod","ormtype":"string","isVisible":true,"isSearchable":true,"title":"Process Method","sorting":{"active":false,"sortOrder":"asc","priority":0},"key":"processMethod"},{"isDeletable":true,"isExportable":true,"propertyIdentifier":"_entityqueue.entityQueueType","ormtype":"rbKey","isVisible":true,"isSearchable":true,"title":"Entity Queue Type","sorting":{"active":false,"sortOrder":"asc","priority":0},"key":"entityQueueType"},{"isDeletable":true,"isExportable":true,"propertyIdentifier":"_entityqueue.entityQueueDateTime","ormtype":"timestamp","isVisible":true,"isSearchable":true,"title":"Entity Queue Date Time","sorting":{"active":false,"sortOrder":"asc","priority":0},"key":"entityQueueDateTime"},{"isDeletable":true,"isExportable":true,"propertyIdentifier":"_entityqueue.entityQueueData","ormtype":"string","isVisible":true,"isSearchable":true,"title":"Entity Queue Data","sorting":{"active":false,"sortOrder":"asc","priority":0},"key":"entityQueueData"},{"isDeletable":true,"isExportable":true,"propertyIdentifier":"_entityqueue.logHistoryFlag","ormtype":"boolean","isVisible":true,"isSearchable":true,"title":"Log Queue History","sorting":{"active":false,"sortOrder":"desc","priority":0},"key":"logHistoryFlag"},{"title":"Processing","propertyIdentifier":"_entityqueue.processingFlag","isVisible":true,"isDeletable":true,"isSearchable":true,"isExportable":true,"ormtype":"boolean","type":"none","sorting":{"active":true,"sortOrder":"desc","priority":1},"key":"processingFlag"}],"keywordColumns":[],"filterGroups":[{"filterGroup":[]}],"currentPage":1,"pageShow":10,"defaultColumns":false,"dirtyRead":false,"orderBy":[{"propertyIdentifier":"_entityqueue.processingFlag","direction":"desc"}]}' />
    </Records>
</Table>
