@isTest
public with sharing class TrialOrgControllerTest {
    @isTest
    public static void getObjectPrefixIfObjectNameIsBlank(){
        try{
            string objectPrefix = TrialOrgController.getObjectPrefix('');
        }
        catch(Exception ex){
            system.assert(true);
        }
    }
    @isTest
    public static void getObjectPrefixIfObjectNameIsInCorrect(){
        try{
            string objectPrefix = TrialOrgController.getObjectPrefix('LeadObj');
            system.assertEquals(objectPrefix, '');
        }
        catch(Exception ex){
            System.assert(false);
        }
       
    }
    @isTest
    public static void getObjectPrefixWithCorrectData(){
        try{
            string objectPrefix = TrialOrgController.getObjectPrefix('Lead');
            system.assertEquals(objectPrefix, '00Q');
        }
        catch(Exception ex){
            System.assert(false);
        }
    }
}