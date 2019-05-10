var threadViewHandler;
var contentViewPannel;
var contactListObject = {};

InboxSDK.load('1', 'sdk_MailContact_b5e5169e77').then((sdk) => {
  let contact;
  sdk.Conversations.registerMessageViewHandler((messageView) => {
    console.log('MSG State :: ', messageView.getViewState());
    if(messageView.getViewState() == 'EXPANDED'){
      let senderInfo = messageView.getSender();
      contactListObject[senderInfo.emailAddress] = senderInfo.name;
      messageView.getRecipientsFull().then((recipientinfo) => {
        recipientinfo.forEach(element => {
          console.log('element :: ', element);
          if(element.name){
            contactListObject[element.emailAddress] = element.name;
          } else{
            let getName = (element.emailAddress).split('@');
            contactListObject[element.emailAddress] = getName[0];
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
    console.log('All Msg :: ', allMsg);
    for(let y = 0 ; y < allMsg.length ; y++){
        let thisMsg = allMsg[y];
        if(!(thisMsg.getViewState() == 'HIDDEN')){
          console.log("Index :: ", y+1);
          let senderInfo = thisMsg.getSender();
          console.log('Sender Info :: ', senderInfo);
          contactListObject[senderInfo.emailAddress] = senderInfo.name;
          thisMsg.getRecipientsFull().then((recipientinfo) => {
            recipientinfo.forEach(element => {
              console.log('element in :: ', element);
              contactListObject[element.emailAddress] = element.name;
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
  console.log('contactListObject :: ', contactListObject);
  let createdElement = document.createElement("div");
  createdElement.style = "padding-left: 20px"
  let contactDiv = '<div>';
  for(let key of Object.keys(contactListObject)){
    contactDiv += '<div style="font-size: 14px; font-weight: bold; padding: 5px 0px; color: green"><span style="padding-right:3px">' + (1) + ') </span>' + '<span>' + contactListObject[key] + '</span><span>' + key + '</span></div>';
  };
  contactDiv += '</div>';
  createdElement.innerHTML = contactDiv;
  contentViewPannel = threadViewHandler.addSidebarContentPanel({
    title: 'Contact List',
    el:createdElement,
  });
}