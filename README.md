Assessment Lockdown
===========

Browser Lockdown for Assessments

#### Motivation:
Teachers at the moment without a lockdown browser or management system have difficulty in ensuring students aren't cheating during assessments. We hope to give teachers confidence in the assessment data as well as prevent students from cheating but looking at other resources during assessments.

#### Description:
This chrome extension once activated locks down on a specific tab and window combination until it is told to release this lock. Once locked the user is unable to navigate to another tab or window.

#### Getting started:
0. Download this repository
1. Navigate to chrome://extensions
2. Click "Load unpacked extension" and select the folder you just downloaded (ensure developer mode is checked)

#### Usage:

With message passing (https://developer.chrome.com/extensions/runtime#method-sendMessage) a website (in this case summitlearning.org) will send a message, passing the extensionId, message, and callback. The extensionId must match the extensionId of *assessment-lockdown* when installed on the client (you can find the extensionId by going to chrome://extensions). The message must be either "assessment_started" or "assessment_ended". Callback should be used to confirm acknowledgement. The callback will help ensure that the extension was not tampered with or removed. 

Start Lockdown:     
```
chrome.runtime.sendMessage("mjnekdnnjfefplhanbefioofcndkejah", {method: "assessment_started"}, (response) => {
  if (!response || !response.message !== "success") {
    throw Error("Something went wrong with assessment lockdown.");
  }
});
```
Stop Lockdown: 
```
chrome.runtime.sendMessage("mjnekdnnjfefplhanbefioofcndkejah", {method: "assessment_ended"});
```

#### Notes: Once the chrome extension is deployed in the chrome store the extensionId will be fixed. The extension can be "unlisted" where only those with access to the link can find the extension. Deployment to the store would be ideal as this would be easier for tech admins rather than passing around or hosting an offline crx file.
