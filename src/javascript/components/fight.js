import { controls } from '../../constants/controls';

//refactor dat shit

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
    let pressedKeys = new Set()

  
    firstFighter.healthIndicator = document.getElementById('left-fighter-indicator')
    firstFighter.currentHealth = firstFighter.health
    firstFighter.criticalStrike = true
  
    secondFighter.healthIndicator = document.getElementById('right-fighter-indicator')
    secondFighter.currentHealth = secondFighter.health
    secondFighter.criticalStrike = true
  
  
    function onKeyDown (e) {
      if(e.repeat) return
      if(pressedKeys.has(controls.PlayerOneAttack) && !pressedKeys.has(controls.PlayerTwoBlock)) {
        secondFighter.currentHealth = secondFighter.currentHealth - getDamage(firstFighter, secondFighter)
        secondFighter.healthIndicator.style.width = secondFighter.currentHealth / secondFighter.health * 100 + '%'
      }

      if(pressedKeys.has(controls.PlayerTwoAttack) && !pressedKeys.has(controls.PlayerOneBlock)) {
        firstFighter.currentHealth = firstFighter.currentHealth - getDamage(secondFighter, firstFighter)
        firstFighter.healthIndicator.style.width = firstFighter.currentHealth / firstFighter.health * 100 + '%'
      }

      if(pressedKeys.has(controls.PlayerOneCriticalHitCombination[0]) && pressedKeys.has(controls.PlayerOneCriticalHitCombination[1]) && pressedKeys.has(controls.PlayerOneCriticalHitCombination[2]) && firstFighter.criticalStrike) {
        secondFighter.currentHealth = secondFighter.currentHealth - criticalStrike(firstFighter)
        secondFighter.healthIndicator.style.width = secondFighter.currentHealth / secondFighter.health * 100 + '%'
      }

      if(pressedKeys.has(controls.PlayerTwoCriticalHitCombination[0]) && pressedKeys.has(controls.PlayerTwoCriticalHitCombination[1]) && pressedKeys.has(controls.PlayerTwoCriticalHitCombination[2]) && secondFighter.criticalStrike) {
        firstFighter.currentHealth = firstFighter.currentHealth - criticalStrike(secondFighter)
        firstFighter.healthIndicator.style.width = firstFighter.currentHealth / firstFighter.health * 100 + '%'
      }


      if(firstFighter.currentHealth <= 0) {
        resolve(secondFighter)
        
      } else if (secondFighter.currentHealth <= 0) {
        resolve(firstFighter)
      }
    }
    
    document.addEventListener('keydown', e => pressedKeys.add(e.code))
    document.addEventListener('keyup', e => pressedKeys.delete(e.code))
    document.addEventListener('keydown', onKeyDown)
    
  }); 
}

export function criticalStrike(fighter) {
  if(fighter.criticalStrike) {
    fighter.criticalStrike = false
    setTimeout(() => {
      fighter.criticalStrike = true
    }, 10000);
    return fighter.attack * 2
  }
}

export function getDamage(attacker, defender) {
  // return damage
  let damage = getHitPower(attacker) - getBlockPower(defender)
  if(damage < 0) return 0
  return damage
}

export function getHitPower(fighter) {
  // return hit power
  return fighter.attack * getRandomIntInclusive(1, 2)
}

export function getBlockPower(fighter) {
  // return block power
  return fighter.defense * getRandomIntInclusive(1, 2)
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}