export const sampleChats = [
  {
    avatar: [
      "https://static.vecteezy.com/system/resources/previews/027/951/137/large_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png",
    ],
    name: "John Doe",
    _id: "1",
    groupChat: false,
    members: ["1", "2"],
  },
  {
    avatar: [
      "https://avatarfiles.alphacoders.com/374/374883.png",
      "https://avatarfiles.alphacoders.com/374/374883.png",
      "https://avatarfiles.alphacoders.com/374/374883.png",
      "https://avatarfiles.alphacoders.com/374/374883.png",
      "https://avatarfiles.alphacoders.com/374/374883.png",
      "https://avatarfiles.alphacoders.com/374/374883.png",
      "https://avatarfiles.alphacoders.com/374/374883.png",
      "https://avatarfiles.alphacoders.com/374/374883.png",
    ],
    name: "Group Chat 1",
    _id: "2",
    groupChat: true,
    members: ["1", "2", "3", "4"],
  },
  {
    avatar: ["https://avatarfiles.alphacoders.com/375/375196.png"],
    name: "Jane Smith",
    _id: "3",
    groupChat: false,
    members: ["3", "4"],
  },
  {
    avatar: [
      "https://avatarfiles.alphacoders.com/376/376001.png",
      "https://avatarfiles.alphacoders.com/376/376001.png",
      "https://avatarfiles.alphacoders.com/376/376001.png",
    ],
    name: "Group Chat 2",
    _id: "4",
    groupChat: true,
    members: ["2", "3", "4"],
  },
];

export const sampleUsers = [
  {
    name: "John Doe",
    _id: "1",
    avatar:
      "https://static.vecteezy.com/system/resources/previews/027/951/137/large_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png",
  },
  {
    name: "Jane Doe",
    _id: "2",
    avatar: "https://avatarfiles.alphacoders.com/374/374883.png",
  },
  {
    name: "Alice Smith",
    _id: "3",
    avatar: "https://avatarfiles.alphacoders.com/375/375196.png",
  },
  {
    name: "Bob Johnson",
    _id: "4",
    avatar: "https://avatarfiles.alphacoders.com/376/376001.png",
  },
];

export const sampleNotifications = [
  {
    sender: {
      avatar: "https://avatarfiles.alphacoders.com/374/374883.png",
      name: "Jane Doe",
    },
    _id: "1",
    message: "You have a new message from Jane Doe.",
  },
  {
    sender: {
      avatar: "https://avatarfiles.alphacoders.com/375/375196.png",
      name: "Alice Smith",
    },
    _id: "2",
    message: "Alice Smith mentioned you in a comment.",
  },
  {
    sender: {
      avatar: "https://avatarfiles.alphacoders.com/376/376001.png",
      name: "Bob Johnson",
    },
    _id: "3",
    message: "Bob Johnson liked your post.",
  },
];

export const sampleMessages = [
  {
    attachments: [
      {
        public_id: "1",
        url: "https://static.vecteezy.com/system/resources/previews/027/951/137/large_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png",
      },
    ],
    content: "Hello, how are you?",
    _id: "1",
    sender: {
      _id: "1",
      name: "John Doe",
    },
    chat: "chat_1",
    createdAt: "2022-03-26T10:43:36.000Z",
  },
  {
    attachments: [],
    content: "I am fine, thank you!",
    _id: "2",
    sender: {
      _id: "2",
      name: "Jane Doe",
    },
    chat: "chat_1",
    createdAt: "2022-03-26T10:44:36.000Z",
  },
  {
    attachments: [],
    content: "Are we meeting tomorrow?",
    _id: "3",
    sender: {
      _id: "3",
      name: "Alice Smith",
    },
    chat: "chat_2",
    createdAt: "2022-03-26T11:00:36.000Z",
  },
  {
    attachments: [
      {
        public_id: "2",
        url: "https://avatarfiles.alphacoders.com/376/376001.png",
      },
    ],
    content: "Yes, at 10 AM.",
    _id: "4",
    sender: {
      _id: "4",
      name: "Bob Johnson",
    },
    chat: "chat_2",
    createdAt: "2022-03-26T11:10:36.000Z",
  },
];

export const DashboardData = {
  users: [
    {
      name: "John Doe",
      _id: "1",
      avatar:
        "https://static.vecteezy.com/system/resources/previews/027/951/137/large_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png",
      groups: 5,
      friends: 50,
      username: "johndoe",
    },
    {
      name: "Jane Doe",
      _id: "2",
      avatar: "https://avatarfiles.alphacoders.com/374/374883.png",
      groups: 3,
      friends: 30,
      username: "janedoe",
    },
    {
      name: "Alice Smith",
      _id: "3",
      avatar: "https://avatarfiles.alphacoders.com/375/375196.png",
      groups: 4,
      friends: 40,
      username: "alicesmith",
    },
    {
      name: "Bob Johnson",
      _id: "4",
      avatar: "https://avatarfiles.alphacoders.com/376/376001.png",
      groups: 2,
      friends: 20,
      username: "bobjohnson",
    },
  ],
};
