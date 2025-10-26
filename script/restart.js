const { exec } = require("child_process");

module.exports = {
  config: {
    name: "restart",
    description: "Redémarrer le bot",
  },
  run: ({ api, event, config }) => {
    if (!config.admin.includes(event.senderID))
      return api.sendMessage("🚫 Pouvoir interdit.", event.threadID);
    
    api.sendMessage("🔄 Le Créateur redémarre le système...", event.threadID, () => {
      exec("pm2 restart goatbot || node index.js");
    });
  }
};
