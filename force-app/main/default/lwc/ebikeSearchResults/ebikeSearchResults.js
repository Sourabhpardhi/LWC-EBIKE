import { LightningElement, wire, api } from 'lwc';
import getEbikeList from '@salesforce/apex/EbikeController.getEbikeList';
import { publish, MessageContext } from 'lightning/messageService';
import SELECTED_EBIKE_CHANNEL from '@salesforce/messageChannel/SelectedEbike__c';


export default class EbikeSearchResults extends LightningElement {

    ebikesCategory='';
    ebikesData;
    selectedEbikeId;
    
    @wire(getEbikeList, {category : '$ebikesCategory'})
    wiredEbikes({error, data}){
        if(error){
            console.error(error);
        }
        else if(data){
            this.ebikesData = data;
            console.log('this.ebikesData:'+JSON.stringify(this.ebikesData));
        }
    }

    @wire(MessageContext)
    messageContext;

    handleClickEbikeCard(event){
        this.selectedEbikeId = event.currentTarget.dataset.id;
        console.log('this.selectedEbikeId'+JSON.stringify(this.selectedEbikeId))

        //publishihng selected ebike id to LMS channel
        publish(this.messageContext , SELECTED_EBIKE_CHANNEL , { ebikeId : this.selectedEbikeId});

        let boxClass = this.template.querySelectorAll('.selected');
        if(boxClass.length >0){
            this.removeClass();
        }

        // current selected player card details
        let playerBox = this.template.querySelector(`[data-id="${this.selectedEbikeId}"]`);

        if(playerBox){
            playerBox.className='title_wrapper selected';
        }

        //custom event firing to parent.
        this.dispatchEvent(new CustomEvent('select',{
            detail:{
                ebikeId: this.selectedEbikeId
            }
        }))
    }
    removeClass(){
        this.template.querySelectorAll('.selected')[0].classList.remove('selected');
    }

    @api searchEbike(categoryOfEbike){
        console.log('value in child lwc'+JSON.stringify(categoryOfEbike));
        this.ebikesCategory=categoryOfEbike;

    }
}
