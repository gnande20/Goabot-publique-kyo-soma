const fs = require("fs");

module.exports = {
  config: {
    name: "creator",
    description: "Commandes spéciales du Créateur - Auteur: Karma Akabane"
  },
  run: ({ api, event, config }) => {
    const creatorID = "TON_ID_FACEBOOK_ICI"; // Remplace par ton vrai senderID
    if (event.senderID !== creatorID) {
      return api.sendMessage("🚫 Seul Camille peut utiliser ces commandes spéciales !", event.threadID);
    }

    // Commandes spéciales
    const commands = {
      power: () => {
        const messages = [
          `⚡ 𝗣𝗢𝗨𝗩𝗢𝗜𝗥 𝗨𝗟𝗧𝗜𝗠𝗘 ⚡\nLe Gardien d’Ombre se réveille...\n🔥 Le monde s’incline devant Camille !`,
          `💥 𝗣𝗢𝗨𝗩𝗢𝗜𝗥 𝗗𝗘 𝗖𝗥É𝗔𝗧𝗘𝗨𝗥 💥\nLes ténèbres tremblent...\n✨ Camille déchaîne son pouvoir !`
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        const media = "./media/power.gif"; // GIF épique
        api.sendMessage({ body: randomMessage, attachment: fs.createReadStream(media) }, event.threadID);
      },
      vanish: () => {
        api.deleteMessage(event.threadID, event.messageID, (err) => {
          if (err) api.sendMessage("❌ Impossible de supprimer le message.", event.threadID);
        });
      },
      summon: () => {
        const mediaList = ["./media/summon1.gif", "./media/summon2.gif"];
        const media = mediaList[Math.floor(Math.random() * mediaList.length)];
        api.sendMessage({ body: "✨ Invocation spéciale du Créateur !", attachment: fs.createReadStream(media) }, event.threadID);
      },
      announce: () => {
        const message = "📢 Annonce du Créateur : Tout le monde doit s’incliner devant Camille !";
        // Ici tu peux ajouter le code pour envoyer à tous les threads où le bot est actif
        api.sendMessage(message, event.threadID);
      }
    };

    // Extraire la commande envoyée
    const args = event.body.split(" "); // exemple : "creator power"
    const cmd = args[1];
    if (cmd && commands[cmd]) {
      commands[cmd]();
    } else {
      // Liste des commandes si aucune ou mauvaise commande
      api.sendMessage(`
⚡ Commandes Spéciales du Créateur ⚡

1️⃣ creator power - Déchaîner le pouvoir ultime
2️⃣ creator vanish - Faire disparaître un message
3️⃣ creator summon - Envoyer un GIF épique
4️⃣ creator announce - Faire une annonce
Auteur : Karma Akabane
`, event.threadID);
    }
  }
};
