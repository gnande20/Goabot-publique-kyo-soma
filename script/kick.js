module.exports = {
  config: {
    name: "kick",
    description: "Expulser un membre du groupe",
  },
  run: ({ api, event, args, config }) => {
    if (!config.admin.includes(event.senderID))
      return api.sendMessage("🚫 Pouvoir refusé. Seul le Créateur peut bannir.", event.threadID);
    
    const mention = Object.keys(event.mentions)[0];
    if (!mention) return api.sendMessage("👤 Mentionne la personne à expulser.", event.threadID);
    
    api.removeUserFromGroup(mention, event.threadID, err => {
      if (err) return api.sendMessage("❌ Impossible de l’expulser.", event.threadID);
      api.sendMessage(`🔥 ${event.mentions[mention]} a été banni par le Créateur.`, event.threadID);
    });
  }
};
