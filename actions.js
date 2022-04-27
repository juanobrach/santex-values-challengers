import { app } from './app.js';

const postMessageToChannel = async (channelId, messageBlock) => {
  try {
    // Call the chat.postMessage method using the WebClient
    const result = await app.client.chat.postMessage({
      channel: channelId,
      blocks: messageBlock,
    });

    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

// franco verzino => U2RJXREP6

const scheduleMessage = async () => {
  // Unix timestamp for tomorrow morning at 9AM
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0);

  // Channel you want to post the message to
  const channelId = 'C12345';

  try {
    // Call the chat.scheduleMessage method using the WebClient
    const result = await client.chat.scheduleMessage({
      channel: channelId,
      text: 'Looking towards the future',
      // Time to post message, in Unix Epoch timestamp format
      post_at: tomorrow.getTime() / 1000,
    });

    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

export { postMessageToChannel, scheduleMessage };
