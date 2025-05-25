const storyEl = document.getElementById('story');
const choicesEl = document.getElementById('choices');
const inventoryEl = document.getElementById('inventory');
const mapEl = document.getElementById('map');
const sceneImage = document.getElementById('scene-image');

let inventory = [];
let companions = [];
let currentLocation = "start";

const locations = ["town", "forest", "tavern", "cave"];
const locationNames = {
  start: "town",
  forest: "forest",
  forest_taken: "forest_taken",
  tavern: "tavern",
  tavern_hired: "tavern_hired",
  cave: "cave",
  fight: "fight",
  treasure: "treasure"
};

const locationImages = {
  town: "./images/town.png",
  forest: "./images/forest.png",
  forest_taken: "./images/forest_taken.png",
  tavern: "./images/tavern.png",
  tavern_hired: "./images/tavern_hired.png",
  cave: "./images/cave.png",
  fight: "./images/fight.png",
  treasure: "./images/treasure.png"
};

function updateInventory() {
  inventoryEl.textContent = `Inventory: [${inventory.join(', ')}] | Companions: [${companions.join(', ')}]`;
}

function updateMap() {
  mapEl.innerHTML = "";
  locations.forEach(loc => {
    const locDiv = document.createElement("div");
    locDiv.textContent = loc.charAt(0).toUpperCase() + loc.slice(1);
    if (loc === locationNames[currentLocation]) {
      locDiv.classList.add("active");
    }
    mapEl.appendChild(locDiv);
  });
}

function showScene(sceneKey) {
  currentLocation = sceneKey;
  const scene = scenes[sceneKey];

  // Update UI
  storyEl.textContent = scene.text;
  choicesEl.innerHTML = "";

  // Update image
  const loc = locationNames[sceneKey] || "town";
  sceneImage.src = locationImages[loc];
  sceneImage.alt = `${loc} scene`;

  // Update map
  updateMap();

  // Show choices
  scene.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.onclick = () => {
      // Special logic: fight
      if (choice.text === "Fight the monster") {
        const hasSword = inventory.includes("sword");
        const hasWizard = companions.includes("mighty wizard");

        if (hasSword && hasWizard) {
          alert("You and the mighty wizard defeat the monster!");
        } else {
          alert("You are not prepared. You don't have any weapon nor a companion to assist you in the fight.");
          return;
        }
      }

      // Special logic: hire wizard
      if (choice.text === "Hire the mighty wizard") {
        if (inventory.includes("gold coins")) {
          inventory = inventory.filter(item => item !== "gold coins");
          if (!companions.includes("mighty wizard")) companions.push("mighty wizard");
          alert("The wizard joins your party.");
          updateInventory();
        } else {
          alert("You don't have enough gold.");
          return;
        }
      }

      if (choice.effect) choice.effect();
      showScene(choice.next);
    };
    choicesEl.appendChild(btn);
  });
}

const scenes = {
  start: {
    text: "You're in the town square. Paths lead to the forest, a tavern, and a dark cave.",
    choices: [
      { text: "Go to the forest", next: "forest" },
      { text: "Visit the tavern", next: "tavern" },
      { text: "Head to the cave", next: "cave" }
    ]
  },
  forest: {
    text: "You find the corpse of a fallen knight. Nearby lie a sword and a bag of gold coins.",
    choices: [
      {
        text: "Take sword and gold",
        next: "forest_taken",
        effect: () => {
          if (!inventory.includes("sword")) inventory.push("sword");
          if (!inventory.includes("gold coins")) inventory.push("gold coins");
          updateInventory();
        }
      },
      { text: "Return to town", next: "start" }
    ]
  },
  forest_taken: {
    text: "You picked up the sword and gold. It may prove useful.",
    choices: [
      { text: "Return to town", next: "start" }
    ]
  },
  tavern: {
    text: "You enter the smoky tavern. A mighty wizard offers his help — for a price.",
    choices: [
      {
        text: "Hire the mighty wizard",
        next: "tavern_hired"
      },
      { text: "Return to town", next: "start" }
    ]
  },
  tavern_hired: {
    text: "The mighty wizard nods and joins your adventure.",
    choices: [
      { text: "Return to town", next: "start" }
    ]
  },
  cave: {
    text: "You arrive at the cave. A terrifying monster blocks your path!",
    choices: [
      { text: "Fight the monster", next: "fight" },
      { text: "Run back to town", next: "start" }
    ]
  },
  fight: {
    text: "The monster lies defeated. Behind it, a treasure glows brightly!",
    choices: [
      {
        text: "Take the treasure",
        next: "treasure",
        effect: () => {
          if (!inventory.includes("golden idol")) inventory.push("golden idol");
          updateInventory();
        }
      }
    ]
  },
  treasure: {
    text: "You found a golden idol! You win the game!",
    choices: [
      {
        text: "Play again",
        next: "start",
        effect: () => {
          inventory = [];
          companions = [];
          updateInventory();
        }
      }
    ]
  }
};

updateInventory();
showScene("start");
