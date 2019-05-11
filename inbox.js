var threadViewHandler;
var contentViewPannel;
var contactListObject = {};

InboxSDK.load('1', 'sdk_MailContact_b5e5169e77').then((sdk) => {
  sdk.Conversations.registerMessageViewHandler((messageView) => {
    if(messageView.getViewState() == 'EXPANDED'){
      let senderInfo = messageView.getSender();
      contactListObject[senderInfo.emailAddress] = senderInfo.name;
      messageView.getRecipientsFull().then((recipientinfo) => {
        recipientinfo.forEach(recipient => {
          if(recipient.name){
            contactListObject[recipient.emailAddress] = recipient.name;
          } else{
            let getName = (recipient.emailAddress).split('@');
            contactListObject[recipient.emailAddress] = getName[0];
          }
        });
        showSidebarWithContact();
      }).catch((error) => {
        showSidebarWithContact();
      })
    }
  });

  sdk.Conversations.registerThreadViewHandler((threadView) => {
    contactListObject = {};
    threadViewHandler = threadView;
    var allMsg = threadView.getMessageViewsAll();
    for(let y = 0 ; y < allMsg.length ; y++){
      let mailDetails = allMsg[y];
      if(!(mailDetails.getViewState() == 'HIDDEN')){
        let senderInfo = mailDetails.getSender();
        contactListObject[senderInfo.emailAddress] = senderInfo.name;
        mailDetails.getRecipientsFull().then((recipientinfo) => {
          recipientinfo.forEach(recipient => {
            contactListObject[recipient.emailAddress] = recipient.name;
          });
        })
      }
    }
    showSidebarWithContact();
  });
});

const showSidebarWithContact = () => {
  if(contentViewPannel){
    contentViewPannel.remove();
  }
  let createdElement = document.createElement("div");
  createdElement.style = "padding-left: 20px"
  let contactDiv = '<div>';
  for(let key of Object.keys(contactListObject)){
    contactDiv += '<div style="font-size: 14px; font-weight: bold; padding: 5px 0px; color: green"><span style="padding-right:5px">' + contactListObject[key] + '</span><span> : ' + key + '</span></div>';
  };
  contactDiv += '</div>';
  createdElement.innerHTML = contactDiv;
  contentViewPannel = threadViewHandler.addSidebarContentPanel({
    title: 'Contact List',
    el:createdElement,
  });
}