 import { LightningElement, wire } from 'lwc';
 import { subscribe,MessageContext } from 'lightning/messageService';
 import SELECTED_EBIKE_CHANNEL from '@salesforce/messageChannel/SelectedEbike__c';
 import getSelectedEbikeDetail from '@salesforce/apex/EbikeController.getSelectedEbikeDetail';
 import { NavigationMixin } from 'lightning/navigation';

export default class EbikeDetailCard extends NavigationMixin(LightningElement) {
    selectedEbikeId;
    ebikeData;

    @wire(MessageContext)
    messageContext;

    connectedCallback(){

        subscribe(
            this.messageContext,
            SELECTED_EBIKE_CHANNEL,
            (message)=>{
                console.log('message from LMS:'+JSON.stringify(message));
                this.handleSelectedEbike(message.ebikeId)

            }
        )
        
    }
    handleSelectedEbike(ebikeId){
        this.selectedEbikeId = ebikeId;

        getSelectedEbikeDetail({ebikeId:this.selectedEbikeId})
        .then(result=>{
            this.ebikeData = result;
            console.log('Selected Ebike Detail:'+JSON.stringify(result))

        })
        .catch(error=>{
            console.error(error);

        })


    }

    handleNavigateToRecord(){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes:{
                recordId:this.selectedEbikeId,
                objectApiName: 'Ebikes__c',
                actionName: 'view'
            }
        })
    }
}
    