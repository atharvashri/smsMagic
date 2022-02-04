import { LightningElement, wire, track } from 'lwc';

// Import the URL for the static resources
import double_opt_in from '@salesforce/resourceUrl/double_opt_in';
import inquiry_qualification from '@salesforce/resourceUrl/inquiry_qualification';
import nurture_campaign from '@salesforce/resourceUrl/nurture_campaign';
import document_collection from '@salesforce/resourceUrl/document_collection';
import support_handling from '@salesforce/resourceUrl/support_handling';
import resourceUrl from '@salesforce/resourceUrl/test';
import refreshApex from '@salesforce/apex';
import getObjectPrefix from '@salesforce/apex/TrialOrgController.getObjectPrefix';
import getCreatedLeadId from '@salesforce/apex/TrialOrgController.getCreatedLeadId';
import triggerInquiryMessage from '@salesforce/apex/TrialOrgController.triggerInquiryMessage';
import triggerNPSSurveyMessage from '@salesforce/apex/TrialOrgController.triggerNPSSurveyMessage';
import getCurrentUserNameDataOfApp from '@salesforce/apex/TrialOrgController.getCurrentUserName';
import getToolTipStatus from '@salesforce/apex/TrialOrgController.getToolTipManagerStatus';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import FIRST_NAME from '@salesforce/schema/Lead.FirstName';
import LAST_NAME from '@salesforce/schema/Lead.LastName';
import MOBILE_PHONE from '@salesforce/schema/Lead.MobilePhone';
import NAME from '@salesforce/schema/Lead.Name';
import LEAD_SOURCE from '@salesforce/schema/Lead.LeadSource'; 


// Import custom labels
import Conversational_Info from '@salesforce/label/c.Conversational_Info';
import Conversational_Messaging from '@salesforce/label/c.Conversational_Messaging';
import Conversational_Avoid from '@salesforce/label/c.Conversational_Avoid';
import Conversational_Ready from '@salesforce/label/c.Conversational_Ready';
import Double_opt_in from '@salesforce/label/c.Double_opt_in';
import Include_Request from '@salesforce/label/c.Include_Request';
import Explore_Double_opt from '@salesforce/label/c.Explore_Double_opt';
import The_Inquiry_Qualification from '@salesforce/label/c.The_Inquiry_Qualification';
import Includes_two_sample from '@salesforce/label/c.Includes_two_sample';
import Trigger_Flow from '@salesforce/label/c.Trigger_Flow';
import The_Nurture_Campaign from '@salesforce/label/c.The_Nurture_Campaign';
import Includes_two_campaign from '@salesforce/label/c.Includes_two_campaign';
import Trigger_Campaign from '@salesforce/label/c.Trigger_Campaign';
import The_Document_Collection from '@salesforce/label/c.The_Document_Collection';
import Includes_document_request from '@salesforce/label/c.Includes_document_request';
import Experience_Flow from '@salesforce/label/c.Experience_Flow';
import ExperienceSupport_survey from '@salesforce/label/c.ExperienceSupport_survey';
import Includes_initiation_handling from '@salesforce/label/c.Includes_initiation_handling';
import Case_studies from '@salesforce/label/c.Case_studies';
import Read_Story from '@salesforce/label/c.Read_Story';

export default class TrialOrgMainComponent extends LightningElement {

    // Expose the static resource URL for use in the template

    @track userName;

    double_opt_in = double_opt_in;
    inquiry_qualification = inquiry_qualification;
    nurture_campaign = nurture_campaign;
    document_collection = document_collection;
    support_handling = support_handling;
    
    resourceUrl = resourceUrl;
    @track welcomeMsg;
    isLightning;
    consentObjectPrefix;
    objectForPrefixName = 'Lead';
    isModalOpen = false;
    toastMessage = '';
    showSpinner = false;
    
    caseStudyData = [
        {
         "shortIntro": "Learn how Beer Home Team, a real estate firm from Southern California, uses conversational messaging to smoothen and speed up big decisions of buying or selling a house.",
         "Customer": "Beer Home Team",
         "Country": "USA",
         "exactIndustry": "Real Estate",
         "relatedIndustry": "Mortgage",
         "caseStudyUrl": "https:\/\/www.sms-magic.com\/case-studies\/beer-home-team-streamlines-the-buying-and-selling-process-with-messaging\/",
         "caseStudyImage" : 'https://smsmagic-13d6c.kxcdn.com/wp-content/uploads/2020/05/Beer-Home-Team.png'
        },
        {
         "shortIntro": "Learn how a mortgage lender uses conversational messaging to reassure borrowers throughout the long stressful phase of applying for a home loan and buying a house.",
         "Customer": "Unnamed",
         "Country": "-",
         "exactIndustry": "Mortgage",
         "relatedIndustry": "Real Estate, Financial Services",
         "caseStudyUrl": "https:\/\/www.sms-magic.com\/case-studies\/a-mortgage-lender-increases-conversions-with-messaging\/",
         "caseStudyImage" : 'https://smsmagic-13d6c.kxcdn.com/wp-content/uploads/2020/05/A-Mortgage-Lender-Increases-Conversions-with-Messaging.png'   
        },
        {
         "shortIntro": "Learn how FreedomCare, a home healthcare company in NY, used conversational messaging to monitor recovering COVID-19 patients from home and to free up hospital beds to save more lives.",
         "Customer": "FreedomCare",
         "Country": "USA",
         "exactIndustry": "Healthcare",
         "relatedIndustry": "-",
         "caseStudyUrl": "https:\/\/www.sms-magic.com\/sms-resources\/sms-case-studies\/freedomcare-case-study-full\/",
         "caseStudyImage" : 'https://yt3.ggpht.com/ytc/AKedOLQeMKG7vdfeeYVW3EZtkfSGaZaVaSspmA9e-KYc=s900-c-k-c0x00ffffff-no-rj'   
        },
        {
         "shortIntro": "Learn how Australian Institute of Business uses conversational messaging to increase contactability and engagement with students and to speed up enrollments.",
         "Customer": "Australian Institute of Business",
         "Country": "AUS",
         "exactIndustry": "Higher Education",
         "relatedIndustry": "Ed Tech",
         "caseStudyUrl": "https:\/\/www.sms-magic.com\/case-studies\/aib-drives-student-enrollment-with-messaging\/",
         "caseStudyImage" : 'https://smsmagic-13d6c.kxcdn.com/wp-content/uploads/2020/05/AIB-Increases-Enrollment-with-Messaging-Thumb.jpg' 
        },
        {
         "shortIntro": "Learn how Wavelength’s 40+ recruiters in Australia, use conversational messaging to reach out to more candidates, faster.",
         "Customer": "Wavelength",
         "Country": "AUS",
         "exactIndustry": "Staffing",
         "relatedIndustry": "-",
         "caseStudyUrl": "https:\/\/www.sms-magic.com\/case-studies\/wavelength-speeds-time-to-hire-with-messaging\/",
         "caseStudyImage" :'https://www.sms-magic.com/wp-content/uploads/2021/02/Header_PNG_HR-compressed.jpg'
        },
        {
         "shortIntro": "Learn how LifeMoves, a nonprofit serving the homeless in Silicon Valley uses conversational messaging to maintain contact with clients and to ensure they are self-sufficient in the long term.",
         "Customer": "LifeMoves",
         "Country": "USA",
         "exactIndustry": "Non-Profit",
         "relatedIndustry": "-",
         "caseStudyUrl": "https:\/\/www.sms-magic.com\/case-studies\/lifemoves-uses-messaging-to-connect-with-clients\/",
         "caseStudyImage" :'https://smsmagic-13d6c.kxcdn.com/wp-content/uploads/2020/05/LifeMoves-Uses-Messaging-to-Improve-Client-Engagement.png'
        },
        {
         "shortIntro": "Learn how Oral Roberts University, a premier Christian university in Oklahoma uses conversational messaging to increase response rates, reduce no-shows by 90% and fastrack admissions.",
         "Customer": "Oral Roberts University",
         "Country": "USA",
         "exactIndustry": "Higher Education",
         "relatedIndustry": "Ed Tech",
         "caseStudyUrl": "https:\/\/www.sms-magic.com\/case-studies\/oral-roberts-university-increases-response-rates-with-messaging\/",
         "caseStudyImage" :'https://smsmagic-13d6c.kxcdn.com/wp-content/uploads/2020/05/Oral-Roberts-Case-Study-Thumb.jpg'
        },
        {
         "shortIntro": "Learn how Northwest University, a top ranked Christian liberal arts college near Seattle, uses conversational messaging to increase prospective student engagement by 15X.",
         "Customer": "Northwest University",
         "Country": "USA",
         "exactIndustry": "Higher Education",
         "relatedIndustry": "Ed Tech",
         "caseStudyUrl": "https:\/\/www.sms-magic.com\/case-studies\/northwest-university-sees-15x-student-engagement-with-text-messaging\/",
         "caseStudyImage" :'https://smsmagic-13d6c.kxcdn.com/wp-content/uploads/2020/05/Northwest_University_Sees_15X_Student_Engagement_with_Text_Messaging_thumb-1.jpg'
        },
        {
         "shortIntro": "Learn how College Possible, a non-profit organization in America, uses conversational messaging to coach and enable low income students to go to college and graduate.",
         "Customer": "College Possible",
         "Country": "USA",
         "exactIndustry": "Non-Profit",
         "relatedIndustry": "Higher Education, Ed Tech",
         "caseStudyUrl": "https:\/\/www.sms-magic.com\/case-studies\/college-possible-increases-enrollment-rates-with-messaging\/",
         "caseStudyImage" :'https://smsmagic-13d6c.kxcdn.com/wp-content/uploads/2020/05/College-Possible-Increases-Enrollment-Rates-with-Messaging.png'
        },
        {
         "shortIntro": "Learn how Stork Driver, a car leasing company for rideshare drivers in America, uses conversational messaging to nurture leads and resolve service issues faster and with better staff efficiency.",
         "Customer": "Stork Driver",
         "Country": "USA",
         "exactIndustry": "Car leasing",
         "relatedIndustry": "-",
         "caseStudyUrl": "https:\/\/www.sms-magic.com\/case-studies\/conversational-text-messaging-is-key-to-stork-drivers-business-growth\/",
         "caseStudyImage" :'https://smsmagic-13d6c.kxcdn.com/wp-content/uploads/2020/05/Case-Study-Stork-Driver-Thumb.jpg'
        },
        {
         "shortIntro": "Learn how Grassroot Soccer, a public health NGO in Cape Town, South Africa, deploys conversational messaing to use the power of soccer to educate, inspire, and mobilize difficult to reach communities to stop the spread of HIV.",
         "Customer": "Grassroot Soccer",
         "Country": "South Africa",
         "exactIndustry": "Non-Profit",
         "relatedIndustry": "-",
         "caseStudyUrl": "https:\/\/www.sms-magic.com\/case-studies\/grassroot-soccer\/",
         "caseStudyImage" :'https://smsmagic-13d6c.kxcdn.com/wp-content/uploads/2021/02/GRS_H-compressed-2.jpg'
        },
        {
         "shortIntro": "Learn how GIVE Volunteers, a travel-to-volunteer organization, uses conversational messaging to engage with prospective travellers, onboard them and engage them in sustainable development projects.",
         "Customer": "GIVE Volunteers",
         "Country": "USA",
         "exactIndustry": "Travel",
         "relatedIndustry": "Non-Profit",
         "caseStudyUrl": "https:\/\/www.sms-magic.com\/case-studies\/how-give-volunteers-used-sms-magic-to-increase-their-conversions-by-30\/",
         "caseStudyImage" :'https://smsmagic-13d6c.kxcdn.com/wp-content/uploads/2020/05/Case-Study-GIVE-Thumb.jpg'
        },
        {
         "shortIntro": "Learn how United Phosphorus Ltd, a global agricultural company, engages 1.5 million customers every month using conversational messaging.",
         "Customer": "United Phosphorus Ltd.",
         "Country": "India",
         "exactIndustry": "Agriculture",
         "relatedIndustry": "-",
         "caseStudyUrl": "https:\/\/www.sms-magic.com\/case-studies\/how-united-phosphorus-limited-increased-sales-conversions-with-texting\/",
         "caseStudyImage" :'https://smsmagic-13d6c.kxcdn.com/wp-content/uploads/2020/05/Case-Study-UPL-Thumb.jpg'
        },
        {
         "shortIntro": "Learn how Talent Rover, a staffing solutions software, enables its clients with conversational messaging to increase candidate engagement and make more placements.",
         "Customer": "Talent Rover",
         "Country": "USA",
         "exactIndustry": "Staffing Software",
         "relatedIndustry": "Staffing",
         "caseStudyUrl": "https:\/\/www.sms-magic.com\/case-studies\/how-talent-rover-helped-their-clients-increase-candidate-engagement-using-sms-magic\/",
         "caseStudyImage" :'https://smsmagic-13d6c.kxcdn.com/wp-content/uploads/2020/05/Case-Study-Talent-Rover-Thumb.jpg'
        },
        {
         "shortIntro": "Learn how Renault, a multinational automobile manufacturer, uses conversational messaging to provide excellent customer service.",
         "Customer": "Renault",
         "Country": "UK",
         "exactIndustry": "Automobile",
         "relatedIndustry": "Contact Center",
         "caseStudyUrl": "https:\/\/www.sms-magic.com\/case-studies\/how-renault-used-sms-magic-to-provide-excellent-customer-service-via-text-messaging\/",
         "caseStudyImage" :'https://smsmagic-13d6c.kxcdn.com/wp-content/uploads/2020/05/Case-Study-Renault-Thumb.jpg'
        },
        {
         "shortIntro": "Learn how I Want to Study in Australia, a leading enrollment broker, uses conversational messaging to increase conversions by 35%.",
         "Customer": "I Want to Study in Australia",
         "Country": "AUS",
         "exactIndustry": "Enrollment broker",
         "relatedIndustry": "Higher Education, Ed Tech",
         "caseStudyUrl": "https:\/\/www.sms-magic.com\/case-studies\/how-a-leading-australian-enrollment-broker-used-messaging-to-increase-conversions-by-35\/",
         "caseStudyImage" :'https://smsmagic-13d6c.kxcdn.com/wp-content/uploads/2020/05/Case-Study-IWTSIA-Thumb.jpg'
        },
        {
         "shortIntro": "Learn how Sheriff & Associates, a healthcare recruiting and sourcing company in Florida, uses conversational messaging to market open positions, engage candidates, send job alerts, schedule interviews and request information, and make text candidates 10x as valuable as any email candidate.",
         "Customer": "Sheriff & Associates",
         "Country": "USA",
         "exactIndustry": "Staffing",
         "relatedIndustry": "-",
         "caseStudyUrl": "https:\/\/www.sms-magic.com\/case-studies\/increase-candidate-engagement-and-placement-with-sms-messaging\/",
         "caseStudyImage" :'https://smsmagic-13d6c.kxcdn.com/wp-content/uploads/2020/05/Sheriff-and-Associates-thumb.jpg'
        },
        {
         "shortIntro": "Learn how Little Kids Rock, a national nonprofit in the area of music education, uses conversational messaing to stay connected with their community of music educators and deliver more content in an online format during COVID-19 pandemic. ",
         "Customer": "Little Kids Rock",
         "Country": "USA",
         "exactIndustry": "Non-Profit",
         "relatedIndustry": "Higher Education, Ed Tech",
         "caseStudyUrl": "https:\/\/www.sms-magic.com\/case-studies\/nonprofit-little-kids-rock-pivots-to-online-education-lessons-during-covid-19-pandemic\/",
         "caseStudyImage" :'https://smsmagic-13d6c.kxcdn.com/wp-content/uploads/2020/05/AIB-Increases-Enrollment-with-Messaging-Thumb.jpg'
        },
        {
         "shortIntro": "Learn how Upstart, a leading AI lending platform, uses conversational messaging to send timely information to its loan applicants, and convert them into happy customers.",
         "Customer": "Upstart",
         "Country": "USA",
         "exactIndustry": "Financial",
         "relatedIndustry": "Mortgage",
         "caseStudyUrl": "https:\/\/www.sms-magic.com\/case-studies\/upstart\/",
         "caseStudyImage" :'https://smsmagic-13d6c.kxcdn.com/wp-content/uploads/2021/02/UpstartIcon.png'
        },
        {
         "shortIntro": "Learn how HeyTutor uses contextual messaging to increase response rates by 56% and transform the learning experience for students by connecting them with the perfect tutor.",
         "Customer": "HeyTutor",
         "Country": "USA",
         "exactIndustry": "Higher Education",
         "relatedIndustry": "Ed Tech",
         "caseStudyUrl": "https:\/\/www.sms-magic.com\/case-studies\/hey-tutor\/",
         "caseStudyImage" :'https://smsmagic-13d6c.kxcdn.com/wp-content/uploads/2021/02/HeaderImage-1024x464.png'
        },
        {
         "shortIntro": "Learn how Ochre Recruitment uses conversational messaging to improve the availability of urgently required doctors in ANZ hospitals through contextual conversations with candidates during COVID-19.",
         "Customer": "Ochre Recruitment",
         "Country": "Australia",
         "exactIndustry": "Staffing",
         "relatedIndustry": "-",
         "caseStudyUrl": "https:\/\/www.sms-magic.com\/case-studies\/ochre\/",
         "caseStudyImage" :'https://smsmagic-13d6c.kxcdn.com/wp-content/uploads/2021/02/Ochre-bg-scaled-1-1024x464.jpg'
        }
       ]

    fields = [FIRST_NAME, LAST_NAME, MOBILE_PHONE, NAME, LEAD_SOURCE];
    // Expose the labels to use in the template.
    label = {
        Conversational_Messaging,
        Conversational_Info,
        Conversational_Avoid,
        Conversational_Ready,
        Double_opt_in,
        Include_Request,
        Explore_Double_opt,
        The_Inquiry_Qualification,
        Includes_two_sample,
        Trigger_Flow,
        The_Nurture_Campaign,
        Includes_two_campaign,
        Trigger_Campaign,
        The_Document_Collection,
        Includes_document_request,
        Experience_Flow,
        ExperienceSupport_survey,
        Includes_initiation_handling,
        Case_studies,
        Read_Story,
    };
    connectedCallback() {
       this.isLightningExperienceOrSalesforce1();
       getCurrentUserNameDataOfApp().then((res)=>{
            this.userName = res;
            this.welcomeMsg = 'Hi ' + this.userName +', welcome to a 14-day free trial of SMS-Magic.';
       });

       getToolTipStatus({eventName :'doubleOptIn'}).then((res)=>{
            if(res){
                let toolTipdata = {
                    headerMessage : 'WELCOME TO THE SMS-MAGIC TRIAL',
                    infoMessage: 'To experience conversational messaging, start by creating a lead with your own name and mobile phone number.',
                    firstButtonText : 'Got It',
                    secondButtonText : 'Create Lead',
                    firstActionFunction : function () {
                        this.redirectToLeadObject();
                    }.bind(this),
                    secondActionFunction : function () {
                        this.redirectToLeadObject();
                    }.bind(this)
                } 
                let isToolTipOpen = this.openToolTip(toolTipdata);
                if(isToolTipOpen){
                    console.log(isToolTipOpen);
                }
            }
       }).catch((error)=>{
            console.log(error);
       })
    }
   

    isLightningExperienceOrSalesforce1() {
        if(document.referrer.indexOf(".lightning.force.com") > 0){
            this.isLightning =  true;
        }else{
            this.isLightning = false;
        }
    }

    redirectToLeadObject(event){
        this.isModalOpen = true;
    }
    redirectToCampainManager(){
        var urlprefix;
        if(this.isLightning){
            urlprefix = '/lightning/n/SML__Campaign_Manager';
        }
        else{
            urlprefix = '/apex/SML__Campaign_Manager'
        }
		
		this.redirection(urlprefix);
    }
    redirectToConverseDesk(){
        var urlprefix;
        if(this.isLightning){
            urlprefix = '/lightning/n/smagicinteract__Lightning_Desk';
        }
        else{
            urlprefix = '/apex/smagicinteract__Lightning_Desk'
        }
		
		this.redirection(urlprefix);
    }
    redirectToLeadRecord(){
        getCreatedLeadId().then((response) => {
            var urlprefix = '/' + response;
            this.redirection(urlprefix);
        })
    }
    triggerInquiryFlow(){
        this.showSpinner = true;
        triggerInquiryMessage().then(
            (res)=>{
               let toolTipdata = {
                   headerMessage : 'SUCCESS! INQUIRY QUALIFICATION FLOW HAS BEEN TRIGGERED.',
                   infoMessage: 'Pick your mobile phone and respond to the qualification messages.',
                   firstButtonText : 'Next',
                   firstActionFunction : function () {
                       console.log(this.onInquiryToolTipNext);
                       this.onInquiryToolTipNext();
                   }.bind(this)
               } 
               this.showSpinner = false;
               this.openToolTip(toolTipdata);
            }
        ).catch((error)=>{
            this.showSpinner = false;
            this.openToast('error', 'something went wrong', error,'open');
        });
    }
    triggerNPSSurveyMessage(){
        triggerNPSSurveyMessage().then(
        );
    }
    redirection(urlprefix, openInsameWidnow){
        if(!urlprefix){
            return;
        }
        var sanitizedUrl;
        var el;
        if(!urlprefix || !urlprefix.indexOf('script:') !== -1 && urlprefix.indexOf('data:') !== -1) {
            return;
        }
          el = document.createElement('a');
        el.href = urlprefix;
        if (el.protocol === 'https:') {
            sanitizedUrl = encodeURI(urlprefix);
        }
    
        var url = sanitizedUrl;
        if (typeof sforce != 'undefined' && sforce.one) {
            sforce.one.navigateToURL(url);
        } else {
            if(openInsameWidnow){
                window.open(sanitizedUrl);
            }
            else{
                window.open(sanitizedUrl,'_blank'); //window.location.href = url;
            }
        }
    }

    onModalCancel(){
        this.isModalOpen = false;
    }

    navigateToLeadRecordPage(event){
        getObjectPrefix({
            objectName : event.target.name
        }).then((response)=>{
            this.redirection( '/' + response + '/o');
        }).catch((error)=>{
            
        })
    }

    openToast(toastObject){
        let toastRef = this.template.querySelector('c-toast-component');
        toastRef.setToastStyle(toastObject);
        //toastRef.setToastStyle('success', 'test', 'open');
    }
    openToolTip(toolTipObject){
        let toastRef = this.template.querySelector('c-tooltip-component');
        console.log(toastRef)
        return toastRef.setToolTipStyle(toolTipObject);
    }
    onLeadCreationSuccess(){
        let toolTipdata = {
            headerMessage : 'Respond to double opt-in SMS.',
            infoMessage: 'Pick your mobile phone and respond to double opt-in SMS.',
            firstButtonText : 'Got It',
        } 
        this.openToolTip(toolTipdata);
        this.onModalCancel();
    }

    onInquiryToolTipNext(){

        let toolTipdata = {
            headerMessage : 'VIEW INQUIRY QUALIFICATION THREAD',
            infoMessage: 'Click "Go To Converse Desk" to go to the Converse Inbox and view the messages exchanged.',
            firstButtonText : 'Go To Converse Desk',
            firstActionFunction : function () {
                //fire an event and show the 
                console.log(this.redirectToConverseDesk);
                this.redirectToConverseDesk();
            }.bind(this)
        } 
        this.openToolTip(toolTipdata);
        console.log(this.openToolTip);
    }

    onSurveyToolTipNext(){
        let toolTipdata = {
            headerMessage : 'RESPOND TO SUPPORT AND SURVEY MESSAGES',
            infoMessage: 'Respond to support and survey messages received on your mobile phone.',
            firstButtonText : 'Got It',
            secondButtonText :'Finish'
        } 
        this.openToolTip(toolTipdata);
    }

    onSurveyBtnClick(){
        let toolTipdata = {
            headerMessage : 'EXPERIENCE SUPPORT AND SURVEY FLOW',
            infoMessage: 'To seek info on SMS-Magic pricing, pick your mobile phone and send "PRICING" in the same message window where you opted in to receive trial messages from SMS-Magic',
            //firstButtonText : 'Got It',
            firstButtonText : 'Next',
            firstActionFunction : function () {
                //fire an event and show the 
                console.log(this.redirectToConverseDesk);
                this.onSurveyToolTipNext();
            }.bind(this),
            //secondButtonText :'Next'
        } 
        this.openToolTip(toolTipdata);
    }
}