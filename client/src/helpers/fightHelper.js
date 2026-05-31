const MIN_DAMAGE_MULTIPLIER = 1;
const MAX_DAMAGE_MULTIPLIER = 2;
const CRITICAL_DAMAGE_MULTIPLIER = 2;

const getRandomMultiplier = () => {
    return Math.random() * (MAX_DAMAGE_MULTIPLIER - MIN_DAMAGE_MULTIPLIER) + MIN_DAMAGE_MULTIPLIER;
};

const getHitPower = (fighter) => {
    return fighter.power * getRandomMultiplier();
};

const getBlockPower = (fighter) => {
    return fighter.defense * getRandomMultiplier();
};

const getDamage = (attacker, defender) => {
    const damage = getHitPower(attacker) - getBlockPower(defender);

    return Math.max(damage, 0);
};

const getCriticalDamage = (fighter) => {
    return fighter.power * CRITICAL_DAMAGE_MULTIPLIER;
};

export { getHitPower, getBlockPower, getDamage, getCriticalDamage };
