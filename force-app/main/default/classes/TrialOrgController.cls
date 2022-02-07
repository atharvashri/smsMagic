public with sharing class TrialOrgController {
    public TrialOrgController() {
		system.debug('Change testing');
    }

    @AuraEnabled
    public static string getObjectPrefix(string objectName){
        try {
            if(String.isBlank(objectName)){
                throw new AuraHandledException('object name is empty');
            }
            Schema.DescribeSObjectResult objectPrefix = TrialOrgService.getSobjectDescribe(objectName);
            if(objectPrefix != null){
                return objectPrefix.getKeyPrefix();
            }
            else{
                return '';
            }           
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string triggerInquiryMessage(string objectName){

        try{
            id userId = UserInfo.getUserId();
            Lead ld = [Select id, phone from lead where OwnerId =: userId and phone != '' limit 1];
            string senderQuery = 'select id, smagicinteract__senderId__c from smagicinteract__SMS_SenderId__c limit 1';
            sObject sm = Database.query(senderQuery);
            
            sObjectType sObjType = Schema.getGlobalDescribe().get('smagicinteract__smsMagic__c');
            sObject pt = sObjType.newSObject();
            
            pt.put('smagicinteract__SMSText__c', 'Hi, What’s the size of your messaging database? Send BEL for below 50K records or ABV for above 50K records');
            pt.put('smagicinteract__PhoneNumber__c', ld.phone);
            pt.put('smagicinteract__senderid__c', (string)sm.get('smagicinteract__senderId__c'));
            pt.put('smagicinteract__external_field__c', TrialOrgService.generateUniqueKey());
            pt.put('smagicinteract__direction__c', 'OUT');
            Database.insert(pt);
           
            return pt.id;
        }
        catch(Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }


    @AuraEnabled
    public static string getCreatedLeadId(){
        Lead ld = [select id from Lead limit 1];
        return ld.id;
    }

    @AuraEnabled
    public static string triggerNPSSurveyMessage(){

        try{
            id userId = UserInfo.getUserId();
            Lead ld = [Select id, phone from lead where OwnerId =: userId and phone != '' limit 1];
            string senderQuery = 'select id, smagicinteract__senderId__c from smagicinteract__SMS_SenderId__c limit 1';
            sObject sm = Database.query(senderQuery);
            
            sObjectType sObjType = Schema.getGlobalDescribe().get('smagicinteract__smsMagic__c');
            sObject pt = sObjType.newSObject();
            
            pt.put('smagicinteract__SMSText__c', 'Hi, Here’s a link to our different pricing plans as requested www.sms-magic.com/pricing.');
            pt.put('ApiVersion', 42.0);
            pt.put('smagicinteract__PhoneNumber__c', ld.phone);
            pt.put('smagicinteract__senderid__c', (string)sm.get('smagicinteract__senderId__c'));
            pt.put('smagicinteract__external_field__c', TrialOrgService.generateUniqueKey());
            pt.put('smagicinteract__direction__c', 'OUT');
            Database.insert(pt);

            return pt.id;
        }
        catch(Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static string getCurrentUserName(){
        try {
            User u = [select firstname from user where id=:userinfo.getuserid()];
            return u.firstName;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static boolean getToolTipManagerStatus(string eventName){
        try {
           Integer i = [select COUNT() from Lead];
           if(i == 0){
                return true;
           }
           else{
                return false;
           }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

   
}