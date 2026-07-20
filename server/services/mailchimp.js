const Mailchimp = require('mailchimp-api-v3');

const keys = require('../config/keys');

const { key, listKey } = keys.mailchimp;

class MailchimpService {
  init() {
    try {
      return new Mailchimp(key);
    } catch (error) {
      console.warn('Missing mailchimp keys');
    }
  }
}

const mailchimp = key ? new MailchimpService().init() : null;

exports.subscribeToNewsletter = async email => {
  // No Mailchimp credentials (local/CI): treat as successful no-op
  if (!mailchimp || !listKey) {
    return { status: 'subscribed', email_address: email };
  }

  try {
    return await mailchimp.post(`lists/${listKey}/members`, {
      email_address: email,
      status: 'subscribed'
    });
  } catch (error) {
    return error;
  }
};
