# parse-hubspot-mail-adapter
Used to send Parse Server password reset and email verification emails though HubSpot


## How to use
Create your emails within your HubSpot dashboard first!

In your HubSpot emails for **Email Verification** & **Password Reset** please create properties based off of this **_PublicSingleSendRequestEgg_**:
```
{
  message: { recipient },
  contactProperties: { firstname },
  customProperties: { link }, // the link that Parse will create for respective action above
  emailId: 'your email id for respective email template'
}
```

*__Generic Email__*: The body of the generic email will be passed in as a string of markdown.
```
{
  message: { recipient },
  customProperties: { body },
  emailId: 'your email id for respective email template'
}
```

## Configuration in ParseServer

```
const server = ParseServer({
  ...
  emailAdapter: {
    module: 'parse-hubspot-mail-adapter',
    options: {
      // Your Access Token for HubSpot
      accessToken: 'your-hubspot-access-token',
      // Your verification email ID
      verificationEmailId: 'email-id-for-verification-email',
      // Your Password Reset email ID
      passwordResetEmailId: 'email-id-for-password-reset-email',
      // Your generic email ID
      genericEmailId: 'email-id-for-generic-email',
      // This will send the email verification, password reset email with your generic Email Id
      // true if you want to create your emails with HTML instead of creating them in HubSpot.
      genericOnly?: boolean,
      // paths to point to your email html files
      verificationEmailFolder: './public/path/to/verificationEmails',
      passwordResetFolder: './public/path/to/passwordResetEmails',
      // default language if a user does not have a preferred language
      defaultUserLanguage: 'en',
      // the name of the column of the user properties for language preferences
      userLanguagePropertyName: 'lang'
    }
  }
  ...
});
```

## Using genericOnly flag
If you want to send emails based off of a users language please create a folder with two seperate folders for each kind of Email you'd like to send:

*__example__*

```bash
public
├───i18n
│   ├───passwordReset // en.html, ja.html, ar.html
│   └───verificationEmail // en.html, ja.html, ar.html
```

*__HTML Templates__*: 
**en.html**:
```html
<div>
  <p> Hello <%= firstname %><p>
  <p> Please verify your email with this <a href="<%= link %>">link</a>.<p>
</div>
```

Please write your HTML with the *ejs* template sytax, as this adapter will be looking to replace them.
