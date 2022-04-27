import { app } from '../app.js';

// Find conversation ID using the conversations.list method
export const findConversation = async (name) => {
  try {
    const result = await app.client.conversations.list({
      token: process.env.SLACK_BOT_TOKEN,
      types: 'im, private_channel',
    });

    // result.channels.map((channel) => console.log('channel.name:', channel));
    return channels;
  } catch (error) {
    console.error(error);
  }
};

export const conversationInfo = async (userId) => {
  try {
    return await app.client.conversations.info({
      channel: userId,
    });
  } catch (error) {
    console.log('error:', error.data);
  }
};

export const hasConversation = async (otherUserId) => {
  try {
    return await app.client.users.conversations({
      types: 'im, private_channel, mpim',
    });
  } catch (error) {
    console.log('error:', error);
  }
};
