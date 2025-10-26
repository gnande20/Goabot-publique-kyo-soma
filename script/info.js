module.exports = {
  config: {
    name: "info",
    description: "Afficher les infos du bot",
  },
  run: ({ api, event, config }) => {
    const info = `
🤖 GoatBot Créateur Info
🧠 Créé par : ${config.adminName}
⚙️ Préfixe : ${config.prefix}
🌍 Langue : ${config.language}
💬 Bienvenue auto : ${config.welcome ? "Activé" : "Désactivé"}
`;
    
    api.sendMessage(info, event.threadID);
  }
};
