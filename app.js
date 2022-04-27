import dotenv from 'dotenv';
import pkg from '@slack/bolt';
import { hasConversation } from './api/chats.js';
import { postMessageToChannel } from './actions.js';

dotenv.config();

const { App } = pkg;

const buildChatRecomendationBlocks = (userName) => [
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: 'Your weekly *#Challenge* :muscle:',
    },
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `Te proponemos que inicies una conversación con <example.com|@${userName}> (Transformación Digital). Te damos un dato:a ${userName} le gusta de AC/DC :guitar: y los gatos :cat:`,
    },
  },
  {
    type: 'actions',
    elements: [
      {
        type: 'button',
        text: {
          type: 'plain_text',
          emoji: true,
          text: 'INICIAR CONVERSACIÓN',
        },
        style: 'primary',
        value: 'click_me_123',
      },
    ],
  },
];

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

const getUsers = async () => {
  const result = await app.client.users.list({ limit: 40 });
  return result.members
    .filter(
      ({ deleted, is_bot, is_email_confirmed }) =>
        !deleted && !is_bot && is_email_confirmed
    )
    .map((member) => ({
      id: member.id,
      realName: member.real_name,
      is_bot: member.is_bot,
    }));
};

// Find conversation with a specified channel `name`
/* Add functionality here */
// Listens to incoming messages that contain "hello"

let _users = {};
let users = await getUsers();
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
const checkUserChats = async () => {
  console.log('users:', users);
  if (users.length > 0) {
    for (const user of users) {
      await sleep(5000);

      _users[user.id] = {
        name: user.realName,
        id: user.id,
        chattedWith: [],
      };

      // console.log('otherUser:', otherUser);
      console.log('  otherUser.id:', user.id);
      const conversations = await hasConversation(user.id);
      if (conversations.channels) {
        for (const conversation of conversations.channels) {
          const channelInfo = await app.client.conversations.info({
            channel: conversation.id,
            include_num_members: true,
          });
          // await sleep(1000);
          // console.log(
          //   'channelInfo.channel.user:',
          //   channelInfo.channel.user
          // );
          // const otherUser = await app.client.users.profile.get({
          //   user: channelInfo.channel.user,
          // });
          // await sleep(1000);

          // if (channelInfo.channel.user === user.id) continue;

          _users[user.id].chattedWith.push(channelInfo.channel.user);
          // console.log({
          //   user,
          //   otherUser: {
          //     name: otherUser.profile.display_name,
          //     id: channelInfo.channel.user,
          //   },
          //   conversationId: conversation.id,
          // });
          // console.log('_users:', _users);
        }
      }
    }
  }
  return _users;
};
(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
  const checkedUsers = await checkUserChats();

  Object.values(checkedUsers).forEach((checkedUser) => {
    for (const user of users) {
      console.log('iterating user:', user);
      if (!checkedUser.chattedWith.includes(user.id)) {
        console.log(
          `${checkedUser.name} : ${checkedUser.id} not chatted yet with`,
          user
        );

        postMessageToChannel(
          'U038D7ZQPUY',
          buildChatRecomendationBlocks(user.realName)
        );
        break;
      }
    }
  });

  // for (const user of checkedUsers) {
  //   console.log('user:', user);
  // }

  // console.log('users:', users);
  // await Promise.all(
  //   users.map(async (user) => {
  //     console.log('user:', user.name);
  //     const conversation = await hasConversation(user.id);
  //     console.log('conversation:', conversation);
  //   })
  // );

  // const _hasConversation = await hasConversation();
  // console.log('hasConversation:', _hasConversation);
  // findConversation();
  // const conversation = await hasConversation('U038D7ZQPUY');
  // console.log('conversation:', conversation);

  // const auth = await app.client.auth.test();
  // console.log('auth:', auth);
})();

export { app };
