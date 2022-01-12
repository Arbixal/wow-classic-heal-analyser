import cloth from './cloth';
import leather from './leather';
import mail from './mail';
import plate from './plate';

import idol from './idol/relic.json';
import libram from './libram/relic.json';
import totem from './totem/relic.json';

import rings from './miscellaneous/finger.json';
import neck from './miscellaneous/neck.json';

import offhandfrills from './miscellaneous/held-in-off-hand.json';
import shields from './shield/off-hand.json';

// eslint-disable-next-line import/no-anonymous-default-export
export default [...cloth, ...leather, ...mail, ...plate, ...idol, ...libram, ...totem, ...rings, ...neck, ...offhandfrills, ...shields];

export const relics = [...idol, ...libram, ...totem];
export const jewellery = [...rings, ...neck];
export const offhand = [...offhandfrills, ...shields];

export {default as trinkets} from './miscellaneous/trinket.json';