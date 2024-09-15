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
  chats: [
    {
      name: "Chat 1",
      _id: "1",
      avatar: ["https://avatarfiles.alphacoders.com/374/374883.png"],
      totalMembers: 5,
      totalMessages: 10,
      groupChat: false,
      members: [
        {
          _id: "1",
          avatar:
            "https://static.vecteezy.com/system/resources/previews/027/951/137/large_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png",
        },
        {
          _id: "2",
          avatar: "https://avatarfiles.alphacoders.com/374/374883.png",
        },
      ],
      creator: {
        name: "John Doe",
        _id: "1",
        avatar:
          "https://static.vecteezy.com/system/resources/previews/027/951/137/large_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png",
      },
    },
    {
      name: "Chat 2",
      _id: "2",
      avatar: ["https://avatarfiles.alphacoders.com/123/123456.png"],
      totalMembers: 8,
      totalMessages: 20,
      groupChat: true,
      members: [
        {
          _id: "2",
          avatar:
            "https://static.vecteezy.com/system/resources/previews/025/512/939/large_2x/3d-illustration-of-a-woman-avatars-png.png",
        },
        {
          _id: "3",
          avatar: "https://avatarfiles.alphacoders.com/123/123456.png",
        },
        {
          _id: "4",
          avatar: "https://avatarfiles.alphacoders.com/789/789456.png",
        },
        {
          _id: "5",
          avatar: "https://avatarfiles.alphacoders.com/567/567891.png",
        },
      ],
      creator: {
        name: "Jane Smith",
        _id: "2",
        avatar:
          "https://static.vecteezy.com/system/resources/previews/025/512/939/large_2x/3d-illustration-of-a-woman-avatars-png.png",
      },
    },
    {
      name: "Chat 3",
      _id: "3",
      avatar: ["https://avatarfiles.alphacoders.com/789/789456.png"],
      totalMembers: 12,
      totalMessages: 15,
      groupChat: true,
      members: [
        {
          _id: "3",
          avatar:
            "https://static.vecteezy.com/system/resources/previews/027/844/597/large_2x/3d-illustration-of-a-woman-avatars-png.png",
        },
        {
          _id: "4",
          avatar: "https://avatarfiles.alphacoders.com/789/789456.png",
        },
        {
          _id: "5",
          avatar: "https://avatarfiles.alphacoders.com/890/890123.png",
        },
        {
          _id: "6",
          avatar: "https://avatarfiles.alphacoders.com/321/321654.png",
        },
        {
          _id: "7",
          avatar: "https://avatarfiles.alphacoders.com/654/654321.png",
        },
      ],
      creator: {
        name: "Alice Johnson",
        _id: "3",
        avatar:
          "https://static.vecteezy.com/system/resources/previews/027/844/597/large_2x/3d-illustration-of-a-woman-avatars-png.png",
      },
    },
    {
      name: "Chat 4",
      _id: "4",
      avatar: ["https://avatarfiles.alphacoders.com/567/567891.png"],
      totalMembers: 3,
      totalMessages: 8,
      groupChat: false,
      members: [
        {
          _id: "4",
          avatar:
            "https://static.vecteezy.com/system/resources/previews/023/661/619/large_2x/3d-avatar-of-a-man-wearing-glasses-png.png",
        },
        {
          _id: "5",
          avatar: "https://avatarfiles.alphacoders.com/567/567891.png",
        },
      ],
      creator: {
        name: "Bob Brown",
        _id: "4",
        avatar:
          "https://static.vecteezy.com/system/resources/previews/023/661/619/large_2x/3d-avatar-of-a-man-wearing-glasses-png.png",
      },
    },
    {
      name: "Chat 5",
      _id: "5",
      avatar: ["https://avatarfiles.alphacoders.com/890/890123.png"],
      totalMembers: 10,
      totalMessages: 25,
      groupChat: true,
      members: [
        {
          _id: "5",
          avatar:
            "https://static.vecteezy.com/system/resources/previews/028/020/789/large_2x/3d-avatar-of-a-young-man-png.png",
        },
        {
          _id: "6",
          avatar: "https://avatarfiles.alphacoders.com/890/890123.png",
        },
        {
          _id: "7",
          avatar: "https://avatarfiles.alphacoders.com/374/374883.png",
        },
        {
          _id: "8",
          avatar: "https://avatarfiles.alphacoders.com/123/123456.png",
        },
        {
          _id: "9",
          avatar:
            "https://static.vecteezy.com/system/resources/previews/025/512/948/large_2x/3d-woman-avatar-png.png",
        },
      ],
      creator: {
        name: "Charlie Davis",
        _id: "5",
        avatar:
          "https://static.vecteezy.com/system/resources/previews/028/020/789/large_2x/3d-avatar-of-a-young-man-png.png",
      },
    },
    {
      name: "Chat 6",
      _id: "6",
      avatar: ["https://avatarfiles.alphacoders.com/321/321654.png"],
      totalMembers: 7,
      totalMessages: 12,
      groupChat: true,
      members: [
        {
          _id: "6",
          avatar:
            "https://static.vecteezy.com/system/resources/previews/024/169/434/large_2x/3d-woman-avatar-png.png",
        },
        {
          _id: "7",
          avatar: "https://avatarfiles.alphacoders.com/321/321654.png",
        },
        {
          _id: "8",
          avatar: "https://avatarfiles.alphacoders.com/987/987654.png",
        },
      ],
      creator: {
        name: "Eve Williams",
        _id: "6",
        avatar:
          "https://static.vecteezy.com/system/resources/previews/024/169/434/large_2x/3d-woman-avatar-png.png",
      },
    },
    {
      name: "Chat 7",
      _id: "7",
      avatar: ["https://avatarfiles.alphacoders.com/654/654321.png"],
      totalMembers: 15,
      totalMessages: 30,
      groupChat: true,
      members: [
        {
          _id: "7",
          avatar:
            "https://static.vecteezy.com/system/resources/previews/025/495/930/large_2x/3d-illustration-of-a-man-avatar-png.png",
        },
        {
          _id: "8",
          avatar: "https://avatarfiles.alphacoders.com/654/654321.png",
        },
        {
          _id: "9",
          avatar: "https://avatarfiles.alphacoders.com/374/374883.png",
        },
        {
          _id: "10",
          avatar:
            "https://static.vecteezy.com/system/resources/previews/025/512/948/large_2x/3d-woman-avatar-png.png",
        },
      ],
      creator: {
        name: "Frank Miller",
        _id: "7",
        avatar:
          "https://static.vecteezy.com/system/resources/previews/025/495/930/large_2x/3d-illustration-of-a-man-avatar-png.png",
      },
    },
    {
      name: "Chat 8",
      _id: "8",
      avatar: ["https://avatarfiles.alphacoders.com/987/987654.png"],
      totalMembers: 4,
      totalMessages: 5,
      groupChat: false,
      members: [
        {
          _id: "8",
          avatar:
            "https://static.vecteezy.com/system/resources/previews/025/512/948/large_2x/3d-woman-avatar-png.png",
        },
        {
          _id: "9",
          avatar: "https://avatarfiles.alphacoders.com/987/987654.png",
        },
      ],
      creator: {
        name: "Grace Wilson",
        _id: "8",
        avatar:
          "https://static.vecteezy.com/system/resources/previews/025/512/948/large_2x/3d-woman-avatar-png.png",
      },
    },
    {
      name: "Chat 9",
      _id: "9",
      avatar: ["https://avatarfiles.alphacoders.com/112/112233.png"],
      totalMembers: 6,
      totalMessages: 18,
      groupChat: true,
      members: [
        {
          _id: "9",
          avatar:
            "https://static.vecteezy.com/system/resources/previews/028/020/798/large_2x/3d-illustration-of-a-man-avatar-png.png",
        },
        {
          _id: "10",
          avatar: "https://avatarfiles.alphacoders.com/112/112233.png",
        },
        {
          _id: "11",
          avatar: "https://avatarfiles.alphacoders.com/445/445556.png",
        },
      ],
      creator: {
        name: "Henry Taylor",
        _id: "9",
        avatar:
          "https://static.vecteezy.com/system/resources/previews/028/020/798/large_2x/3d-illustration-of-a-man-avatar-png.png",
      },
    },
    {
      name: "Chat 10",
      _id: "10",
      avatar: ["https://avatarfiles.alphacoders.com/445/445556.png"],
      totalMembers: 9,
      totalMessages: 22,
      groupChat: true,
      members: [
        {
          _id: "10",
          avatar:
            "https://static.vecteezy.com/system/resources/previews/025/512/937/large_2x/3d-woman-avatar-png.png",
        },
        {
          _id: "11",
          avatar: "https://avatarfiles.alphacoders.com/445/445556.png",
        },
        {
          _id: "12",
          avatar: "https://avatarfiles.alphacoders.com/890/890123.png",
        },
      ],
      creator: {
        name: "Isla Martin",
        _id: "10",
        avatar:
          "https://static.vecteezy.com/system/resources/previews/025/512/937/large_2x/3d-woman-avatar-png.png",
      },
    },
  ],
  messages: [
    {
      attachment: [
        {
          public_id: "hsdkfhj",
          url: "https://avatarfiles.alphacoders.com/654/654321.png",
        },
      ],
      groupChat: false,
      content: "Hello, how are you?",
      _id: "1",
      sender: {
        _id: "1",
        name: "John Smith",
        avatar:
          "https://static.vecteezy.com/system/resources/previews/025/512/937/large_2x/3d-woman-avatar-png.png",
      },
      chat: "chatId1",
      createdAt: "2020-01-01T00:00:00.000Z",
    },
    {
      attachment: [
        {
          public_id: "asdklfhj",
          url: "https://avatarfiles.alphacoders.com/321/321654.png",
        },
      ],
      groupChat: false,
      content: "Are we still meeting tomorrow?",
      _id: "2",
      sender: {
        _id: "2",
        name: "Jane Doe",
        avatar:
          "https://static.vecteezy.com/system/resources/previews/027/844/597/large_2x/3d-illustration-of-a-woman-avatars-png.png",
      },
      chat: "chatId2",
      createdAt: "2020-01-02T10:00:00.000Z",
    },
    {
      attachment: [
        {
          public_id: "qwerty123",
          url: "https://avatarfiles.alphacoders.com/567/567891.png",
        },
      ],
      groupChat: false,
      content: "Don't forget to bring the documents.",
      _id: "3",
      sender: {
        _id: "3",
        name: "Alice Johnson",
        avatar:
          "https://static.vecteezy.com/system/resources/previews/027/951/137/large_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png",
      },
      chat: "chatId3",
      createdAt: "2020-01-03T15:30:00.000Z",
    },
    {
      attachment: [
        {
          public_id: "mnbvcxz",
          url: "https://avatarfiles.alphacoders.com/890/890123.png",
        },
      ],
      groupChat: false,
      content: "Here's the file you requested.",
      _id: "4",
      sender: {
        _id: "4",
        name: "Bob Brown",
        avatar:
          "https://static.vecteezy.com/system/resources/previews/025/495/930/large_2x/3d-illustration-of-a-man-avatar-png.png",
      },
      chat: "chatId4",
      createdAt: "2020-01-04T08:45:00.000Z",
    },
    {
      attachment: [
        {
          public_id: "zxcvbnm",
          url: "https://avatarfiles.alphacoders.com/374/374883.png",
        },
      ],
      groupChat: false,
      content: "Can you review this report?",
      _id: "5",
      sender: {
        _id: "5",
        name: "Charlie Davis",
        avatar:
          "https://static.vecteezy.com/system/resources/previews/028/020/789/large_2x/3d-avatar-of-a-young-man-png.png",
      },
      chat: "chatId5",
      createdAt: "2020-01-05T12:00:00.000Z",
    },
  ],
};
