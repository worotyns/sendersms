/**
 * @param body Object
 * to: YYXXXXXXXXX
 * webhookAddreess: url,
 * sendTime: date
 * sendingPeriodStart: date
 * sendingPeriodEnd: date
 * fast: true
 * escapeUnicodeCharacters: true
 * sender: NAME, default PushPushGo
 * message: message
 */
module.exports = function send(qs) {
  const uri = 'sendSms';
  const method = 'POST';

  return this.request({uri, qs, method});
};
