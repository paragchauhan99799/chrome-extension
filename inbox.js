InboxSDK.load('1', 'sdk_MailContact_b5e5169e77').then((sdk) => {
	console.log('SDK :: ', sdk);
    sdk.Conversations.registerMessageViewHandler((messageView) => {
        console.log('Message View :: ', messageView);
        var contact = messageView.getRecipientEmailAddresses();
        console.log('Contact :: ', contact);

        messageView.getRecipientsFull().then((list) => {
            console.log('Contact Full List:: ', list);
        });
    });
});