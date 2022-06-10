import { controls } from '../../constants/controls';
import { createElement } from '../helpers/domHelper'

let pressedKeys = new Set()

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over

    firstFighter = objWrapper(firstFighter, 'left')
    secondFighter = objWrapper(secondFighter, 'right')
    onKeyDown = onKeyDown.bind(null, firstFighter, secondFighter, resolve)

    document.addEventListener('keydown', e => pressedKeys.add(e.code))
    document.addEventListener('keyup', e => pressedKeys.delete(e.code))
    document.addEventListener('keydown', onKeyDown)

  });
}

function objWrapper(fighter, position) {
  const wrapper = Object.assign({}, fighter)
  wrapper.healthIndicator = document.getElementById(`${position}-fighter-indicator`)
  wrapper.currentHealth = fighter.health
  wrapper.criticalStrike = true
  return wrapper
}

function onKeyDown(firstFighter, secondFighter, resolve, e) {
  if (e.repeat) return
  if (pressedKeys.has(controls.PlayerOneAttack) && !pressedKeys.has(controls.PlayerTwoBlock)) {
    const damage = getDamage(firstFighter, secondFighter)
    setHealth(secondFighter, damage)
  }

  if (pressedKeys.has(controls.PlayerTwoAttack) && !pressedKeys.has(controls.PlayerOneBlock)) {
    const damage = getDamage(secondFighter, firstFighter)
    setHealth(firstFighter, damage)
  }

  if (pressedKeys.has(controls.PlayerOneCriticalHitCombination[0]) && pressedKeys.has(controls.PlayerOneCriticalHitCombination[1]) && pressedKeys.has(controls.PlayerOneCriticalHitCombination[2]) && firstFighter.criticalStrike) {
    const damage = criticalStrike(firstFighter)
    setHealth(secondFighter, damage)
  }

  if (pressedKeys.has(controls.PlayerTwoCriticalHitCombination[0]) && pressedKeys.has(controls.PlayerTwoCriticalHitCombination[1]) && pressedKeys.has(controls.PlayerTwoCriticalHitCombination[2]) && secondFighter.criticalStrike) {
    const damage = criticalStrike(secondFighter)
    setHealth(firstFighter, damage)
  }


  if (firstFighter.currentHealth <= 0) {
    document.addEventListener('keydown', onKeyDown)
    resolve(secondFighter)

  } else if (secondFighter.currentHealth <= 0) {
    document.removeEventListener('keydown', onKeyDown)
    resolve(firstFighter)
  }
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function setHealth(fighter, damage) {
  if(damage > 0) {
    fighter.currentHealth = fighter.currentHealth - damage
    let cof = fighter.currentHealth / fighter.health * 100
    if(cof < 0){
      cof = 0
    }
    fighter.healthIndicator.style.width = cof  + '%'
    displayHealth(fighter, damage)
  }else {
    displayHealth(fighter, 'Blocked')
  }
}

function criticalStrike(fighter) {
  if (fighter.criticalStrike) {
    fighter.criticalStrike = false
    setTimeout(() => {
      fighter.criticalStrike = true
    }, 10000);
    return fighter.attack * 2
  }
}

function displayHealth(fighter, damage) {
  let el = createElement({
    tagName: 'div',
    className: 'arena__absorbed-damage'
  })
  el.innerText = `-${damage}`
  fighter.healthIndicator.append(el)

  animate({
    duration: 850,
    timing: makeEaseOut(linear),
    draw(progress) {
      el.style.transform = `translateY(${-progress * 60}px)`
      el.style.opacity = `${1 -progress}`
    }
  });
  setTimeout(() => {
    el.remove()
  }, 850);

}

function makeEaseOut(timing) {
  return function(timeFraction) {
    return 1 - timing(1 - timeFraction);
  }
}

function linear(timeFraction) {
  return timeFraction;
}

function animate({timing, draw, duration}) {

  let start = performance.now();

  requestAnimationFrame(function animate(time) {
    // timeFraction изменяется от 0 до 1
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    // вычисление текущего состояния анимации
    let progress = timing(timeFraction);

    draw(progress); // отрисовать её

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }

  });
}


export function getDamage(attacker, defender) {
  // return damage
  let damage = getHitPower(attacker) - getBlockPower(defender)
  if (damage < 0) return 0
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
