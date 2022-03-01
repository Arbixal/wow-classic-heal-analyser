import { arrayToDictionary } from "../utils";
import bosses_raw from "./bosses.json";
import gems_raw from "./gems.json";
import cooldowns_raw from './cooldowns';

export {default as tempWeaponEnchants} from './buffs/temp-enchant.json';
export {default as seasonBuffs} from './buffs/seasonal.json';
export {default as flaskBuffs} from './buffs/flask.json';
export {default as battleElixirBuffs} from './buffs/elixir-battle.json';
export {default as guardianElixirBuffs} from './buffs/elixir-guardian.json';
export {default as scrollBuffs} from './buffs/scroll.json';
export {default as foodBuffs} from './buffs/food.json';
export {default as enchants} from './enchants';

export const bosses = arrayToDictionary(bosses_raw, "id");
export const gemList = arrayToDictionary(gems_raw, "id");
export const cooldownList = arrayToDictionary(cooldowns_raw, "id");