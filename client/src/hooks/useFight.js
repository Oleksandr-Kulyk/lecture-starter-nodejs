import { useCallback, useEffect, useReducer, useRef } from 'react';
import controls from '../constants/controls';
import { CRITICAL_HIT_COOLDOWN } from '../constants/fight';
import { getCriticalDamage, getDamage } from '../helpers/fightHelper';

const FIGHT_ACTIONS = {
    ATTACK: 'attack',
    SET_BLOCK: 'setBlock',
    CRITICAL_HIT: 'criticalHit',
    SET_CRITICAL_HIT_AVAILABLE: 'setCriticalHitAvailable'
};

const createFighterState = (fighter) => ({
    health: fighter.health,
    maxHealth: fighter.health,
    isBlockActive: false,
    isCriticalHitAvailable: true
});

const createInitialFightState = (firstFighter, secondFighter) => ({
    first: createFighterState(firstFighter),
    second: createFighterState(secondFighter),
    winner: null,
    log: []
});

const createAttackLogItem = ({ attackerKey, damage, attackerHealth, defenderHealth }) => ({
    fighter1Shot: attackerKey === 'first' ? damage : 0,
    fighter2Shot: attackerKey === 'second' ? damage : 0,
    fighter1Health: attackerKey === 'first' ? attackerHealth : defenderHealth,
    fighter2Health: attackerKey === 'second' ? attackerHealth : defenderHealth
});

const applyAttack = (state, { attackerKey, defenderKey, attacker, defender }) => {
    if (state.winner) {
        return state;
    }

    const attackerState = state[attackerKey];
    const defenderState = state[defenderKey];

    if (attackerState.isBlockActive || defenderState.isBlockActive) {
        return state;
    }

    const damage = getDamage(attacker, defender);
    const defenderHealth = Math.max(defenderState.health - damage, 0);
    const logItem = createAttackLogItem({
        attackerKey,
        damage,
        attackerHealth: attackerState.health,
        defenderHealth
    });

    return {
        ...state,
        [defenderKey]: {
            ...defenderState,
            health: defenderHealth
        },
        winner: defenderHealth <= 0 ? attacker : state.winner,
        log: [...state.log, logItem]
    };
};

const applyBlock = (state, { fighterKey, isBlockActive }) => {
    if (state.winner || state[fighterKey].isBlockActive === isBlockActive) {
        return state;
    }

    return {
        ...state,
        [fighterKey]: {
            ...state[fighterKey],
            isBlockActive
        }
    };
};

const applyCriticalHit = (state, { attackerKey, defenderKey, attacker }) => {
    if (state.winner) {
        return state;
    }

    const attackerState = state[attackerKey];
    const defenderState = state[defenderKey];

    if (!attackerState.isCriticalHitAvailable || attackerState.isBlockActive) {
        return state;
    }

    const damage = getCriticalDamage(attacker);
    const defenderHealth = Math.max(defenderState.health - damage, 0);
    const logItem = createAttackLogItem({
        attackerKey,
        damage,
        attackerHealth: attackerState.health,
        defenderHealth
    });

    return {
        ...state,
        [attackerKey]: {
            ...attackerState,
            isCriticalHitAvailable: false
        },
        [defenderKey]: {
            ...defenderState,
            health: defenderHealth
        },
        winner: defenderHealth <= 0 ? attacker : state.winner,
        log: [...state.log, logItem]
    };
};

const applyCriticalHitAvailability = (state, { fighterKey, isCriticalHitAvailable }) => {
    if (state[fighterKey].isCriticalHitAvailable === isCriticalHitAvailable) {
        return state;
    }

    return {
        ...state,
        [fighterKey]: {
            ...state[fighterKey],
            isCriticalHitAvailable
        }
    };
};

const fightReducer = (state, action) => {
    switch (action.type) {
        case FIGHT_ACTIONS.ATTACK:
            return applyAttack(state, action.payload);
        case FIGHT_ACTIONS.SET_BLOCK:
            return applyBlock(state, action.payload);
        case FIGHT_ACTIONS.CRITICAL_HIT:
            return applyCriticalHit(state, action.payload);
        case FIGHT_ACTIONS.SET_CRITICAL_HIT_AVAILABLE:
            return applyCriticalHitAvailability(state, action.payload);
        default:
            return state;
    }
};

export default function useFight(firstFighter, secondFighter) {
    const pressedKeysRef = useRef(new Set());
    const fightersRef = useRef({ firstFighter, secondFighter });
    const fightStateRef = useRef(null);
    const criticalHitTimeoutsRef = useRef({
        first: null,
        second: null
    });
    const [fightState, dispatch] = useReducer(
        fightReducer,
        { firstFighter, secondFighter },
        ({ firstFighter: initialFirstFighter, secondFighter: initialSecondFighter }) => (
            createInitialFightState(initialFirstFighter, initialSecondFighter)
        )
    );

    useEffect(() => {
        fightersRef.current = { firstFighter, secondFighter };
    }, [firstFighter, secondFighter]);

    useEffect(() => {
        fightStateRef.current = fightState;
    }, [fightState]);

    const isCombinationPressed = useCallback((combination) => {
        return combination.every((key) => pressedKeysRef.current.has(key));
    }, []);

    const attack = useCallback((attackerKey, defenderKey) => {
        const { firstFighter: currentFirstFighter, secondFighter: currentSecondFighter } = fightersRef.current;
        const attacker = attackerKey === 'first' ? currentFirstFighter : currentSecondFighter;
        const defender = defenderKey === 'first' ? currentFirstFighter : currentSecondFighter;

        dispatch({
            type: FIGHT_ACTIONS.ATTACK,
            payload: {
                attackerKey,
                defenderKey,
                attacker,
                defender
            }
        });
    }, []);

    const canPerformCriticalHit = useCallback((attackerKey) => {
        const currentFightState = fightStateRef.current;
        const attackerState = currentFightState?.[attackerKey];

        return Boolean(
            currentFightState &&
            attackerState &&
            !currentFightState.winner &&
            attackerState.isCriticalHitAvailable &&
            !attackerState.isBlockActive
        );
    }, []);

    const performCriticalHit = useCallback((attackerKey, defenderKey) => {
        if (!canPerformCriticalHit(attackerKey)) {
            return;
        }

        const { firstFighter: currentFirstFighter, secondFighter: currentSecondFighter } = fightersRef.current;
        const attacker = attackerKey === 'first' ? currentFirstFighter : currentSecondFighter;

        dispatch({
            type: FIGHT_ACTIONS.CRITICAL_HIT,
            payload: {
                attackerKey,
                defenderKey,
                attacker
            }
        });

        clearTimeout(criticalHitTimeoutsRef.current[attackerKey]);
        criticalHitTimeoutsRef.current[attackerKey] = setTimeout(() => {
            dispatch({
                type: FIGHT_ACTIONS.SET_CRITICAL_HIT_AVAILABLE,
                payload: {
                    fighterKey: attackerKey,
                    isCriticalHitAvailable: true
                }
            });
        }, CRITICAL_HIT_COOLDOWN);
    }, [canPerformCriticalHit]);

    const setBlockActive = useCallback((fighterKey, isBlockActive) => {
        dispatch({
            type: FIGHT_ACTIONS.SET_BLOCK,
            payload: {
                fighterKey,
                isBlockActive
            }
        });
    }, []);

    useEffect(() => {
        const pressedKeys = pressedKeysRef.current;
        const criticalHitTimeouts = criticalHitTimeoutsRef.current;
        const clearFightEffects = () => {
            pressedKeys.clear();
            clearTimeout(criticalHitTimeouts.first);
            clearTimeout(criticalHitTimeouts.second);
        };

        if (fightState.winner) {
            clearFightEffects();
            return undefined;
        }

        const onKeyDown = (event) => {
            pressedKeys.add(event.code);

            if (event.repeat) {
                return;
            }

            if (isCombinationPressed(controls.PlayerOneCriticalHitCombination)) {
                performCriticalHit('first', 'second');
                return;
            }

            if (isCombinationPressed(controls.PlayerTwoCriticalHitCombination)) {
                performCriticalHit('second', 'first');
                return;
            }

            switch (event.code) {
                case controls.PlayerOneAttack:
                    attack('first', 'second');
                    break;
                case controls.PlayerTwoAttack:
                    attack('second', 'first');
                    break;
                case controls.PlayerOneBlock:
                    setBlockActive('first', true);
                    break;
                case controls.PlayerTwoBlock:
                    setBlockActive('second', true);
                    break;
                default:
                    break;
            }
        };

        const onKeyUp = (event) => {
            pressedKeys.delete(event.code);

            switch (event.code) {
                case controls.PlayerOneBlock:
                    setBlockActive('first', false);
                    break;
                case controls.PlayerTwoBlock:
                    setBlockActive('second', false);
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
            clearFightEffects();
        };
    }, [attack, fightState.winner, isCombinationPressed, performCriticalHit, setBlockActive]);

    return {
        firstFighterState: fightState.first,
        secondFighterState: fightState.second,
        winner: fightState.winner,
        log: fightState.log
    };
}
