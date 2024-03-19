import { LightningElement ,wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import Ebike_Object from '@salesforce/schema/Ebikes__c';
import Category_Field from '@salesforce/schema/Ebikes__c.Category__c';
import getEbikeDetails from '@salesforce/apex/EbikeController.getEbikeDetails';

export default class EBikeSearchFilter extends NavigationMixin(LightningElement) {
    @track selectedEbikeId;
    @track ebikeDetails;

    handleCustomEvent(event) {
        this.selectedEbikeId = event.detail.ebikeId;
        this.retrieveEbikeDetails();
    }

    retrieveEbikeDetails() {
        getEbikeDetails({ ebikeId: this.selectedEbikeId })
            .then(result => {
                this.ebikeDetails = result;
                console.log('retrive:'+JSON.stringify(this.ebikeDetails))
            })
            .catch(error => {
                // Handle error
            });
    }
    recordTypeId;
    picklistValue;
    optionsArray;
    selectedEbikeCategory;
    selectedEbikeId;

    @wire(getObjectInfo,{objectApiName: Ebike_Object})
    objectInfos({data,error}){
        if(error){
            console.log('error:'+JSON.stringify(error))
        }
        else if(data){
            this.recordTypeId = data.defaultRecordTypeId;
            console.log('this.recordTypeId:'+JSON.stringify(this.recordTypeId))
        }
    }
    @wire(getPicklistValues,{recordTypeId: '$recordTypeId', fieldApiName: Category_Field})
    categoryFieldValues({data,error}){
        if(error){
            console.log('error'+JSON.stringify(error))
        }
        else if(data){
            let arr = [];
            this.picklistValue = data.values;
            console.log('picklist data:'+JSON.stringify(this.picklistValue))

            this.picklistValue.forEach(element => {
                arr.push({label: element.value, value : element.value})
            });
            this.optionsArray = arr;
            console.log('this.optionsArrayL:'+JSON.stringify(this.optionsArray))
        }
    }
    createEbikes(){
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes:{
                objectApiName: 'Ebikes__c',
                actionName: 'new'
            }
        })

        
    }
    handleOptionChange(event){
            this.selectedEbikeCategory = event.detail.value;
            console.log('this.selectedEbikeCategory:'+JSON.stringify(this.selectedEbikeCategory));

            this.template.querySelector('c-ebike-search-results').searchEbike(this.selectedEbikeCategory);


    }

    // handleCustomEvent(event){
    //     this.selectedEbikeId = event.detail.ebikeId
    //     console.log(' this.selectedEbikeId in parent lwc:'+JSON.stringify( this.selectedEbikeId));
    // }

}

