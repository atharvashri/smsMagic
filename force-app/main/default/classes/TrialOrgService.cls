public with sharing class TrialOrgService {
    public TrialOrgService() {

    }
    public static Schema.DescribeSObjectResult getSobjectDescribe(String sObjectType){
        if(String.isBlank(sObjectType)) return null;
        Map<String, Schema.SObjectType> lowerCaseGlobalMap = Schema.getGlobalDescribe();
        if(lowerCaseGlobalMap.get(sObjectType.toLowerCase()) == null) return null;
        Schema.DescribeSObjectResult objectResult = lowerCaseGlobalMap.get(sObjectType.toLowerCase()).getDescribe();
        return objectResult;
    }

    public static  string generateUniqueKey(){
        String userId = UserInfo.getUserId();
        Blob blobKey = crypto.generateAesKey(256);
        String key = EncodingUtil.convertToHex(blobKey);
        return  userId+'-'+key; 
    }
}