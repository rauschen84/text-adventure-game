const storyEl = document.getElementById('story');
const choicesEl = document.getElementById('choices');
const inventoryEl = document.getElementById('inventory');

let inventory = [];

function updateInventory() {
    inventoryEl.textContent = `Inventory: [${inventory.join(', ')}]`;
};

function showScene(scene) {
    storyEl.textContent = scene.text;
    choicesEl.innerHTML = '';

    scene.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.textContent = choice.text;
        btn.onclick = () => {
            if (choice.effect) {
                choice.effect();
            };
            showScene(scenes[choice.next]);
        };
        choicesEl.appendChild(btn);
    });
}

const scenes = {
    start: {
        text: "You are at the edge of a dark forest. There’s a path leading into the trees.",
        choices: [
            { text: "Enter the forest", next: "forest" },
            { text: "Walk toward the cave", next: "cave" }
        ]
    },
    forest: {
        text: "You're in a shadowy forest. A stick lies on the ground.",
        choices: [
            { text: "Take the stick", next: "forest_taken", effect: () => inventory.push("stick") },
            { text: "Go to the cave", next: "cave" }
        ]
    },
    forest_taken: {
        text: "You pick up the stick. It might come in handy later.",
        choices: [
            { text: "Go to the cave", next: "cave" }
        ]
    },
    cave: {
        text: "You arrive at a damp cave. There’s a monster blocking the way.",
        choices: [
            { 
                text: "Fight the monster", 
                next: "fight", 
                effect: () => {
                    if (!inventory.includes("stick")) {
                        alert("You have no weapon! You lose.");
                    } else {
                        alert("You fight with your stick and win!");
                    }
                }
            },
            { text: "Run back to the forest", next: "forest" }
        ]
    },
    fight: {
        text: "The monster is defeated. You find a treasure chest behind it!",
        choices: [
            { text: "Open the chest", next: "treasure", effect: () => inventory.push("gold") }
        ]
    },
    treasure: {
        text: "You found gold! You win the game.",
        choices: [
            { text: "Play again", next: "start", effect: () => inventory = [] }
        ]
    }
};

updateInventory();
showScene(scenes.start);