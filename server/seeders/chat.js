import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { faker, simpleFaker } from "@faker-js/faker";

const createSampleChats = async (count) => {
  try {
    const users = await User.find().select("_id");
    const chatPromises = [];

    for (let i = 0; i < count; i++) {
      const user1 = users[Math.floor(Math.random() * users.length)]._id;
      let user2 = users[Math.floor(Math.random() * users.length)]._id;

      // Ensure user2 is different from user1
      while (user1.equals(user2)) {
        user2 = users[Math.floor(Math.random() * users.length)]._id;
      }

      chatPromises.push(
        Chat.create({
          name: faker.lorem.words(5),
          members: [user1, user2],
        })
      );
    }

    await Promise.all(chatPromises);
    console.log("Chats created successfully", count);
  } catch (error) {
    console.error("Error creating chats:", error);
  } finally {
    process.exit(1);
  }
};

const createSampleGroupChats = async (count) => {
  try {
    const users = await User.find().select("_id");
    const chatPromises = [];

    for (let i = 0; i < count; i++) {
      const numMembers = simpleFaker.number.int({ min: 3, max: users.length });
      const members = [];

      while (members.length < numMembers) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        if (!members.includes(randomUser._id)) {
          members.push(randomUser._id);
        }
      }

      console.log(`Creating group chat with members: ${members}`);
      chatPromises.push(
        Chat.create({
          name: faker.lorem.words(1),
          members: members,
          groupChat: true,
          creator: members[0],
        })
      );
    }
    await Promise.all(chatPromises);
    console.log("Group chats created successfully", count);
  } catch (error) {
    console.error("Error creating group chats:", error);
  } finally {
    process.exit(1);
  }
};

const createMessages = async (count) => {
  try {
    const users = await User.find().select("_id");
    const chats = await Chat.find().select("_id");
    const messagePromises = [];

    for (let i = 0; i < count; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomChat = chats[Math.floor(Math.random() * chats.length)];
      messagePromises.push(
        Message.create({
          chat: randomChat._id,
          sender: randomUser._id,
          content: faker.lorem.sentence(),
        })
      );
    }
    await Promise.all(messagePromises);
    console.log("Messages created successfully", count);
  } catch (error) {
    console.error("Error creating messages:", error);
  } finally {
    process.exit(1);
  }
};

const createMessagesInChat = async (chatId, count) => {
  try {
    const users = await User.find().select("_id");
    const messagePromises = [];

    for (let i = 0; i < count; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      messagePromises.push(
        Message.create({
          chat: chatId,
          sender: randomUser._id,
          content: faker.lorem.sentence(),
        })
      );
    }
    await Promise.all(messagePromises);
    console.log("Messages created successfully in chat", count);
  } catch (error) {
    console.error("Error creating messages in chat:", error);
  } finally {
    process.exit(1);
  }
};

export { createSampleChats, createSampleGroupChats, createMessages, createMessagesInChat };
