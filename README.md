# sendersms implementation

Library has only "sms" method implemented

```
const config = {...};
const data = {...};

const sender = new SenderSMS(config);
sender.send(data); // returns promise
```