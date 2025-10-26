module.exports = {
  config: {
    name: "broadcast",
    description: "Envoyer un message global à tous les chats",
  },
  run: ({ api, event, args, config }) => {
    if (!config.admin.includes(event.senderID))
      return api.sendMessage("🚫 Accès réservé au Créateur.", event.threadID);
    
    const message = args.join(" ");
    if (!message) return api.sendMessage("🕊️ Que veux-tu annoncer, Créateur ?", event.threadID);
    
    api.getThreadList(100, null, ["INBOX"], (err, list) => {
      if (err) return console.error(err);
      list.forEach(thread => {
        api.sendMessage(`📢 *Annonce du Créateur ${config.adminName} :*\n${message}`, thread.threadID);
      });
      api.sendMessage("✅ Message envoyé à tous les groupes.", event.threadID);
    });
  }
};
