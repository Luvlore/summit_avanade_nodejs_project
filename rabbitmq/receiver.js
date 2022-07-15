const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (conError, connection) => {
  if (conError) {
    throw conError;
  }

  connection.createChannel((channelError, channel) => {
    if (channelError) {
      throw channelError;
    }

    const QUEUE = 'codingtest';
    channel.assertQueue(QUEUE);
    channel.consume(QUEUE, (msg) => {
      console.log(`Message received: ${msg.content.toString()}`);
    }), {
      noAck: true,
    };
  });
})