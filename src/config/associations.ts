// src/config/associations.ts
import User from "../models/userModel";
import Chat from "../models/Chat";
import ChatMember from "../models/ChatMember";
import Message from "../models/Messge";
import Notification from "../models/Notification";

// User has many ChatMembers
User.hasMany(ChatMember, { foreignKey: "userId", as: "chatMembers" });
ChatMember.belongsTo(User, { foreignKey: "userId", as: "user" });

// Chat has many ChatMembers
Chat.hasMany(ChatMember, { foreignKey: "chatId", as: "chatMembers" });
ChatMember.belongsTo(Chat, { foreignKey: "chatId", as: "chat" });

// Chat has many Messages
Chat.hasMany(Message, { foreignKey: "chatId", as: "messages" });
Message.belongsTo(Chat, { foreignKey: "chatId", as: "chat" });

// User has many Messages
User.hasMany(Message, { foreignKey: "senderId", as: "messages" });
Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });

// User has many Notifications
User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "userId", as: "user" });
