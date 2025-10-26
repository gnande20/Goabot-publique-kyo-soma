const fs = require("fs");

module.exports = {
  config: {
    name: "ban",
    description: "Bannir un utilisateur du bot",
  },
  run: ({ api, event, args, config }) => {
    if (!config.admin.includes(event.senderID))
      return api.sendMessage("🚫 Tu n’as pas ce pouvoir, simple mortel.", event.threadID);
    
    const mention = Object.keys(event.mentions)[0];
    if (!mention) return api.sendMessage("👤 Mentionne quelqu’un à bannir.", event.threadID);
    
    const banned = JSON.parse(fs.readFileSync("./banned.json", "utf8") || "[]");
    banned.push(mention);
    fs.writeFileSync("./banned.json", JSON.stringify(banned, null, 2));
    
    api.sendMessage(`⛔ ${event.mentions[mention]} est maintenant banni du royaume.`, event.threadID);
  }
};
