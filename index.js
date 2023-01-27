const { Client } = require('@hubspot/api-client');
const fs         = require('fs/promises');

const SimpleHubSpotEmailAdapter = hubSpotOptions => {
  if (!hubSpotOptions || !hubSpotOptions.accessToken) {
    throw 'SimpleHubSpotEmailAdapter requires an Access Token';
  }

  //Defaults
  hubSpotOptions.genericOnly         = hubSpotOptions.genericOnly || false;
  hubSpotOptions.defaultUserLanguage = hubSpotOptions.defaultUserLanguage || 'en';
  hubSpotOptions.defaultNameProperty = hubSpotOptions.defaultNameProperty || 'firstName';

  const hubspotClient     = new Client({ accessToken: hubSpotOptions.accessToken });

  const templateLink      = '<%= link %>';
  const templateFirstName = '<%= firstname %>';
  
  const getRecipient = (user) => {
    return user.get('email');
  };

  const sendEmail = async (options) => {
    try {
      const apiResponse = await hubspotClient.marketing.transactional.singleSendApi.sendEmail(options);
      return apiResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const sendVerificationEmail = async (options) => {
    const to         = getRecipient(options.user);
    const firstname  = options.user.get(hubSpotOptions.defaultNameProperty) || '';
    const link       = options.link;
    let emailOptions = {
      message:           { to },
      contactProperties: { firstname },
      customProperties:  { link },
      emailId:           parseInt(hubSpotOptions.verificationEmailId, 10)
    };
    
    const genericOnly = hubSpotOptions.genericOnly;
    if (genericOnly) {
      const locale    = options.user.get(hubSpotOptions.userLanguagePropertyName) || hubSpotOptions.defaultUserLanguage;
      
      const email   = await fs.readFile(`${hubSpotOptions.verificationEmailFolder}/${locale}.html`, { encoding: 'utf-8' });
      const subject = `${hubSpotOptions.appName ? hubSpotOptions.appName + ' | ' : ''}Verify your email`;
      const body    = email.replaceAll(templateLink, link).replaceAll(templateFirstName, firstname);
  
      emailOptions = {
        message:           { to },
        customProperties:  { body, subject },
        emailId:           parseInt(hubSpotOptions.genericEmailId)
      };
    }
  
    return await sendEmail(emailOptions);
  };

  const sendPasswordResetEmail = async (options) => {
    const to        = getRecipient(options.user);
    const firstname = options.user.get(hubSpotOptions.defaultNameProperty) || '';
    const link      = options.link;
    let emailOptions = {
      message:           { to },
      contactProperties: { firstname },
      customProperties:  { link },
      emailId:           parseInt(hubSpotOptions.passwordResetEmailId, 10)
    };
    
    const genericOnly = hubSpotOptions.genericOnly;
    if (genericOnly) {
      const locale    = options.user.get(hubSpotOptions.userLanguagePropertyName) || hubSpotOptions.defaultUserLanguage;

      const email   = await fs.readFile(`${hubSpotOptions.passwordResetFolder}/${locale}.html`, { encoding: 'utf-8' });
      const subject = `${hubSpotOptions.appName ? hubSpotOptions.appName + ' | ' : ''}Reset your password`;
      const body    = email.replaceAll(templateLink, link).replaceAll(templateFirstName, firstname);

      emailOptions = {
        message:           { to },
        customProperties:  { body, subject },
        emailId:           parseInt(hubSpotOptions.genericEmailId)
      };
    }

    return await sendEmail(emailOptions);
  };

  const sendMail = async (mail) => {
    const to = mail.to;
    const body = mail.html || mail.text;
  
    return await sendEmail({
      message:          { to },
      customProperties: { body },
      emailId:          parseInt(hubSpotOptions.genericEmailId, 10)
    });
  };

  return Object.freeze({
    sendVerificationEmail: sendVerificationEmail,
    sendPasswordResetEmail: sendPasswordResetEmail,
    sendMail: sendMail
  });
};

module.exports = SimpleHubSpotEmailAdapter;