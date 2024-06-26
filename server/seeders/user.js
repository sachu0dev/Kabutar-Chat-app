import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { faker, simpleFaker } from "@faker-js/faker";

const createUser = async (numUsers) => {
  try {
    const userPromises = [];
    for (let i = 0; i < numUsers; i++) {
      const tempUser = User.create({
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        password: "123456",
        bio: faker.lorem.sentence(10),
        avatar: {
          url: faker.image.avatar(),
          public_id: faker.system.fileName(),
        },
      });
      userPromises.push(tempUser);
    }
    await Promise.all(userPromises);
    console.log("Users created successfully", numUsers);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(1);
  }
};



export { createUser };
