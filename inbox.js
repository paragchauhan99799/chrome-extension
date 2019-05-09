InboxSDK.load('1', 'sdk_MailContact_b5e5169e77').then((sdk) => {
	console.log('SDK :: ', sdk);
    sdk.Conversations.registerMessageViewHandler((messageView) => {
        console.log('Message View :: ', messageView);
        var contact = messageView.getRecipientEmailAddresses();
        console.log('Contact :: ', contact);
        sdk.Conversations.registerThreadViewHandler((threadView) => {
            console.log('Thread View :: ', threadView);
            const createdElement = document.createElement('div');
            var contactDiv = '<div>';
            for(let x = 0 ; x < contact.length ; x++){
                contactDiv = contactDiv + '<div>' + contact[x] + '</div>'
            };
            contactDiv = contactDiv + '</div>';
            createdElement.innerHTML = contactDiv;
            threadView.addSidebarContentPanel({
                title: 'Contact List',
                createdElement,
            });
        });
    });
    
});