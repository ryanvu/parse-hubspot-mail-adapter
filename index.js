const { Client } = require('@hubspot/api-client');


const SimpleHubSpotEmailAdapter = hubSpotOptions => {
  if (!hubSpotOptions || !hubSpotOptions.accessToken) {
    throw 'SimpleHubSpotEmailAdapter requires an Access Token';
  }

  const hubspotClient = new Client({ accessToken: hubSpotOptions.accessToken });
  
  const getRecipient = (user) => {
    return user.get('email');
  };

  const sendEmail = async (options) => {
    try {
      const apiResponse = await hubspotClient.marketing.transactional.singleSendApi.sendEmail(options);
      return apiResponse;
    } catch (error) {
      return error;
    }
  };

  const sendVerificationEmail = async (options) => {
    const to        = getRecipient(options.user);
    const firstname = options.user.get('firstName') || '';
    const link      = options.link;
    return await sendEmail({
      message:           { to },
      contactProperties: { firstname },
      customProperties:  { link },
      emailId:           hubSpotOptions.verificationEmailId
    });
  };

  const sendPasswordResetEmail = async (options) => {
    const to        = getRecipient(options.user);
    const firstname = options.user.get('firstName') || '';
    const link      = options.link;
    return await sendEmail({
      message:           { to },
      contactProperties: { firstname },
      customProperties:  { link },
      emailId:           hubSpotOptions.passwordResetEmailId
    });
  };

  const sendMail = async (mail) => {
    const to = mail.to;
    const body = mail.html || mail.text;
  
    return await sendEmail({
      message:          { to },
      customProperties: { body },
      emailId:          hubSpotOptions.genericEmailId
    });
  };

  return Object.freeze({
    sendVerificationEmail: sendVerificationEmail,
    sendPasswordResetEmail: sendPasswordResetEmail,
    sendMail: sendMail
  });
};

module.exports = SimpleHubSpotEmailAdapter;