import { z } from "zod";

// User input schema
const signUpSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }).max(50, { message: "Name must be 50 characters or less." }),
  password: z.string().min(3, { message: "Password must be at least 3 characters long." }),
  bio: z.string().max(200, { message: "Bio must be 200 characters or less." }),
  username: z.string().min(3, { message: "Username must be at least 3 characters long." }).max(15, { message: "Username must be 15 characters or less." }),
  avatar: z.object({
    public_id: z.string().min(1, { message: "Avatar public ID is required." }),
    url: z.string().url({ message: "Avatar URL must be a valid URL." })
  })
});

const loginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters long." }).max(15, { message: "Username must be 15 characters or less." }),
  password: z.string().min(3, { message: "Password must be at least 3 characters long." })
});

const searchUserSchema = z.object({
  name: z.string().max(50, { message: "Name must be 50 characters or less." })
});

// Chat input schema
const newGroupSchema = z.object({
  name: z.string().max(50, { message: "Group name must be 50 characters or less." }),
  members: z.array(z.string()).min(1, { message: "At least one member is required." })
});

const addMembersSchema = z.object({
  chatId: z.string().min(1, { message: "Chat ID is required." }),
  members: z.array(z.string()).min(1, { message: "At least one member is required." })
});

const removeMembersSchema = z.object({
  chatId: z.string().min(1, { message: "Chat ID is required." }),
  userId: z.string().min(1, { message: "User ID is required." })
});

const chatIdSchema = z.object({
  chatId: z.string().min(1, { message: "Chat ID is required." })
});

const sendRequestSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." })
});

const acceptRequestSchema = z.object({
  requestId: z.string().min(1, { message: "Request ID is required." }),
  accept: z.boolean({ message: "Accept must be a boolean value." })
});

const adminLoginSchema = z.object({
  secretKey: z.string().min(1, { message: "Secret key is required." })
});

export { signUpSchema, loginSchema, searchUserSchema, newGroupSchema, addMembersSchema, removeMembersSchema, chatIdSchema, sendRequestSchema, acceptRequestSchema , adminLoginSchema};
