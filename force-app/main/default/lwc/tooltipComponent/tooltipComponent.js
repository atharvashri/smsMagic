import { LightningElement,api } from 'lwc';

export default class TooltipComponent extends LightningElement {

    toolTipData;
    showToolTip

    @api
    setToolTipStyle(toolTipData){
     
        this.clearToolTip();
        setTimeout(()=>{
            this.toolTipData = toolTipData;
            this.showToolTip = true;
        },10)
       
        return true;
    }

    executeFirstButtonAction(){
        if(this.toolTipData.firstActionFunction && typeof this.toolTipData.firstActionFunction == 'function'){
            this.toolTipData.firstActionFunction();
        }
        this.clearToolTip()
    }

    executeSecondButtonAction(){
        if(this.toolTipData.secondActionFunction && typeof this.toolTipData.secondActionFunction == 'function'){
            this.toolTipData.secondActionFunction();
        }
        this.clearToolTip()
    }

    clearToolTip(){
        this.toolTipData = {}
        this.showToolTip = false
    }
}