//=============================================================================
// Fishing Plugin
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Adds fishing mechanics to your game.
 * @author Vala411
 *
 * @help Vala_Fishing Plugin
 *
 * This plugin adds fishing mechanics to your RPG Maker MZ game.
 *
 * Plugin Commands:
 *   StartFishing - Starts the fishing minigame.
 *
 * Terms of Use:
 * - Free for use in non-commercial projects.
 * - Free for use in commercial projects
 *
 * @param FishData
 * @text Fish Data
 * @type struct<Fish>[]
 * @desc The data for each fish species available for fishing.
 * @default []
 *
 * @param ClamChance
 * @text Clam Chance
 * @type number
 * @min 0
 * @max 100
 * @desc The chance of getting a clam (in percentage).
 * @default 20
 *
 * @param ClamItem
 * @text Clam Item
 * @type item
 * @desc The item to receive when successfully fishing a clam.
 * @default 2
 *
 * @param PearlChance
 * @text Pearl Chance
 * @type number
 * @min 0
 * @max 100
 * @desc The chance of obtaining a pearl from a clam (in percentage).
 * @default 10
 *
 * @param PearlItem
 * @text Pearl Item
 * @type item
 * @desc The item to receive when obtaining a pearl.
 * @default 3
 * 
 * @param MermaidChance
 * @text Mermaid Chance
 * @type number
 * @min 0
 * @max 100
 * @desc The chance of catching a mermaid (in percentage).
 * @default 1
 *
 * @param MermaidItem
 * @text Mermaid Item
 * @type item
 * @desc The item to receive when successfully catching a mermaid.
 * @default 4
 * 
 * @param MermaidQuest
 * @text Mermaid Quest
 * @type number
 * @desc The ID of the sub-quest activated when catching a mermaid.
 * @default 1
 * 
 * @param RewardGold
 * @text Reward Gold
 * @type number
 * @min 0
 * @desc The amount of gold to reward when successfully fishing.
 * @default 0
*/

/*~struct~Fish:
 * @param Name
 * @text Name
 * @type text
 * @desc The name of the fish species.
 *
 * @param Rarity
 * @text Rarity
 * @type number
 * @min 1
 * @desc The rarity level of the fish species (higher values are rarer).
 * @default 1
 *
 * @param Item
 * @text Item
 * @type item
 * @desc The item to receive when successfully fishing the fish.
 * @default 1
*/

(function() {
    // Retrieve plugin parameters
    var parameters = PluginManager.parameters('FishingPlugin');
    var fishData = JSON.parse(parameters['FishData']) || [];
    var clamChance = Number(parameters['ClamChance']) || 20;
    var clamItem = Number(parameters['ClamItem']) || 2;
    var pearlChance = Number(parameters['PearlChance']) || 10;
    var pearlItem = Number(parameters['PearlItem']) || 3;
    var mermaidChance = Number(parameters['MermaidChance']) || 1;
    var mermaidItem = Number(parameters['MermaidItem']) || 4;
    var mermaidQuest = Number(parameters['MermaidQuest']) || 1;
    var rewardGold = Number(parameters['RewardGold']) || 0;
  
    // Register plugin command
    PluginManager.registerCommand('FishingPlugin', 'StartFishing', function() {
      // Start fishing minigame
      startFishing();
    });
  
    // Start the fishing minigame
    function startFishing() {
      // Determine whether the player successfully catches a fish
      var isFishCaught = Math.random() < getFishChance() / 100;
     // Determine whether the player successfully catches a clam
      var isClamCaught = Math.random() < clamChance / 100;
     // Determine whether the player obtains a pearl from the clam
      var isPearlObtained = Math.random() < pearlChance / 100;
     // Determine whether the player catches a mermaid
     var isMermaidCaught = Math.random() < mermaidChance / 100;
  
      if (isFishCaught) {
        // Get a random fish species
        var fishSpecies = getRandomFishSpecies();
        // Add the fish item to the player's inventory
        $gameParty.gainItem($dataItems[fishSpecies.Item], 1);
        // Reward the player with gold
        $gameParty.gainGold(rewardGold);
        // Display a message indicating the fish was caught
        $gameMessage.add('You caught a ' + fishSpecies.Name + '!');
        // Display a message indicating the gold reward
        $gameMessage.add('You received ' + rewardGold + ' gold!');
    } else if (isClamCaught) {
        // Add the clam item to the player's inventory
        $gameParty.gainItem($dataItems[clamItem], 1);
        // Display a message indicating the clam was caught
        $gameMessage.add('You caught a clam!');
        // Check if the player obtained a pearl from the clam
        if (isPearlObtained) {
          // Add the pearl item to the player's inventory
          $gameParty.gainItem($dataItems[pearlItem], 1);
          // Display a message indicating the pearl reward
          $gameMessage.add('You found a pearl!');
        }
    } else if (isMermaidCaught) {
        // Add the mermaid item to the player's inventory
        $gameParty.gainItem($dataItems[mermaidItem], 1);
        // Display a message indicating the mermaid was caught
        $gameMessage.add('You caught a mermaid! WHAT IN TARNATION?!?!');
      } else {
        // Display a message indicating the fish got away
        $gameMessage.add('Oh no!The fish got away!');
      }
    }
  
    // Calculate the chance of getting a fish based on the rarity of available fish
    function getFishChance() {
      var totalRarity = fishData.reduce(function(sum, fish) {
        return sum + Number(fish.Rarity);
      }, 0);
      return totalRarity > 0 ? 100 / totalRarity : 0;
    }
  
    // Get a random fish species based on their rarity
    function getRandomFishSpecies() {
      var randomValue = Math.random() * 100;
      var cumulativeRarity = 0;
      for (var i = 0; i < fishData.length; i++) {
        cumulativeRarity += Number(fishData[i].Rarity);
        if (randomValue <= cumulativeRarity) {
          return fishData[i];
        }
      }
      return fishData[fishData.length - 1]; // Return the last fish species as fallback
    }
  
    // Register plugin command
    PluginManager.registerCommand('FishingPlugin', 'CatchMermaid', function() {
      // Attempt to catch the mermaid
      catchMermaid();
    });
  
    // Calculate the chance of catching the mermaid
    function getMermaidChance() {
      // Adjust the chance based on your game's balance and rarity
      return 10;
    }
    // Call the cutscene function after catching the mermaid
  playMermaidCutscene();
} 
  // Function to play a cutscene after catching the mermaid
 function playMermaidCutscene() {
  // Pause the game or disable player input during the cutscene

  // Display the cutscene visuals and animations
  showCutsceneVisuals();

  // Play the cutscene audio or background music
  playCutsceneMusic();

  // Show dialogue box and text
  showCutsceneDialogue("Mermaid", "AAAAH! LET ME GO YOU BRUTE!");

  // Wait for the dialogue to finish before continuing

  // Hide the dialogue box

  // Wait for the cutscene to finish playing

  // Resume the game or re-enable player input

  // Continue with the game flow or trigger any subsequent events
}

// Function to display the cutscene visuals and animations
function showCutsceneVisuals() {
  // Code to display the cutscene visuals
  // ...
}

// Function to show the cutscene dialogue box and text
function showCutsceneDialogue(speaker, text) {
  // Code to display the dialogue box and text
  // ...
}
// Function to play the cutscene background music
function playCutsceneMusic() {
    // Create an audio element
  const audio = new Audio();

  // Set the source file of the background music
  audio.src = 'cutscene_music.mp3';

  // Set any additional audio settings, such as volume
  audio.volume = 0.5;

  // Start playing the background music
  audio.play();
}
  
  // Function to stop the cutscene background music
  function stopCutsceneMusic() {
  // Pause and reset the audio element
  audio.pause();
  audio.currentTime = 0;
}
    // Trigger the sub-quest for the caught mermaid
    function onItemObtained(isMermaidCaught) {
        if (item === "Mermaid") {
          startMermaidQuest();
        }
      }