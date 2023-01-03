# parse-hubspot-mail-adapter
Used to send Parse Server password reset and email verification emails though HubSpot


## How to use
** Create your emails within your HubSpot dashboard first!

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
      genericEmailId: 'email-id-for-generic-email'
    }
  }
  ...
});
```