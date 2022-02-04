import { LightningElement, api, track } from 'lwc';

export default class ToastComponent extends LightningElement {

    toastObject = {
        toastButtonText : 'Okay',
        showToastButton : false
    };
    @api
    setToastStyle(toastObject){
        let className;
        this.toastObject = toastObject;
        switch (this.toastObject.toastEvent.toLowerCase()) {
            case 'success':
                className = '.status-notification.success'
                break;
            case 'error':
                className = '.status-notification.error'
                break;
            default:
                break;
        }

        let toastRef = this.template.querySelector(className);
        if(toastRef){
            if(this.toastObject.action.toLowerCase() == 'open'){
                toastRef.classList.remove('slds-hide');
            }
            else{
                toastRef.classList.add('slds-hide');
            }
           
        }

    };
    closeToast(event){
        event.target.parentElement.classList.add('slds-hide');
    };
    executeToastCallBack(){

    }
}