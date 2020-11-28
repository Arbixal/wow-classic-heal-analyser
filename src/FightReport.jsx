import "./FightReport.css";
import {Component} from "react";
import {LogLoader} from "./warcraftLogLoader";
import {msToTime, abbreviateNumber} from "./utils";
import { HealerFightSummary } from "./HealerFightSummary";
import {getHealSummary, HealSummary} from "./healSummary";
import {healingSpells, protectionPotions} from "./data";

export class FightReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            reportId: props.reportId,
            fight: props.fight,
            events: [],
            healers: [],
            isLoaded: false,
            healSummary: null,
            expanded: false
        }

        this.toggle = this.toggle.bind(this);
    }

    loadData() {
        const { reportId, fight, isLoaded } = this.state;
        const {characters} = this.props;
        if (!reportId || !fight || isLoaded)
            return;

        LogLoader.getHealEvents(fight.start_time, fight.end_time)
        .then(
            (result) => {
                let eventsByCharacter = this.getCharactersFromEvents(result);
                let characterList = [];

                for (const [key, value] of Object.entries(eventsByCharacter.characters))
                {
                    let characterName;
                    let characterClass;
                    if (characters[key]) {
                        characterName = characters[key].name;
                        characterClass = characters[key].type;
                    }

                    if (key === '9999') {
                        characterName = "Protection Potions";
                        characterClass = "Consumable";
                    }

                    characterList.push({ 
                        id: key,
                        name: characterName,
                        classType: characterClass,
                        summary: value.total,
                        spells: Object.entries(value.spells).map(keyValuePair => keyValuePair[1])
                    })
                }

                this.setState({
                    isLoaded: true,
                    events: result.events,
                    healSummary: eventsByCharacter.total,
                    healers: characterList
                })
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                })
            }

        );
    }

    getCharactersFromEvents(events) {
        const {pets} = this.props;

        let groupByCharacter = events.reduce((acc, obj) => {
            getHealSummary(acc, obj, (collection, _event) => collection.total);  // Save to totals
            getHealSummary(acc, obj, (collection, event) => {
                let sourceId = event["sourceID"];
                if (pets[sourceId]) {
                    sourceId = pets[sourceId].petOwner;
                }

                let abilityId = event.ability.guid;
                if (protectionPotions[abilityId]) {
                    sourceId = 9999;
                }

                if (!collection.characters[sourceId]) {
                    collection.characters[sourceId] = { total: new HealSummary(), spells: {} };
                }

                return collection.characters[sourceId].total;
            });
            getHealSummary(acc, obj, (collection, event) => {
                let sourceId = event.sourceID;
                if (pets[sourceId]) {
                    sourceId = pets[sourceId].petOwner;
                }
                let spellId = event.ability.guid;
                if (protectionPotions[spellId]) {
                    sourceId = 9999;
                }

                let spell = healingSpells[spellId];
                if (!spell) {
                    return null;
                }

                if (!collection.characters[sourceId].spells[spellId]) {
                    collection.characters[sourceId].spells[spellId] = { id: spellId, name: spell.name, icon: spell.icon, type: spell.type, summary: new HealSummary() };
                }

                return collection.characters[sourceId].spells[spellId].summary;
            })

            return acc;
        }, { total: new HealSummary(), characters: {}})

        return groupByCharacter;
    }

    toggle() {
        this.setState({
            expanded: !this.state.expanded
        });

        this.loadData();
    }

    render() {
        const { error, isLoaded, fight, healSummary, healers, expanded} = this.state;

        let details;
        if (error) {
            details = <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            details = <div>Loading...</div>
        } else {
            let maxHeals = healers.reduce((agg,obj) => {
                if (obj.summary.getTotalHeals() > agg) {
                    agg = obj.summary.getTotalHeals();
                }
                return agg;
            }, 0);
            details = (
            <>
                <table>
                    <thead>
                        <tr>
                            <td className="healer_name" rowSpan="2">Name</td>
                            <td className="healer_consumes" colSpan="4">Consumes</td>
                            <td className="healer_consumes_mana" rowSpan="2">Mana Gained</td>
                            <td className="healer_cooldowns" rowSpan="2">Cooldowns</td>
                            <td className="healer_casts" colSpan="3">Casts</td>
                            <td className="healer_amount" rowSpan="2">Amount</td>
                            <td className="healer_effective center" colSpan="2">Effective</td>
                            <td className="healer_overheal center" colSpan="2">Overheal</td>
                            <td className="healer_wasted center" colSpan="3">Wasted</td>
                        </tr>
                        <tr>
                            <td className="healer_consumes_mana center"><img src="https://assets.rpglogs.com/img/warcraft/abilities/inv_potion_76.jpg" width="24" height="24" alt="Major Mana Potion"/></td>
                            <td className="healer_consumes_runes center"><img src="https://assets.rpglogs.com/img/warcraft/abilities/inv_misc_rune_04.jpg" width="24" height="24" alt="Demonic Runes"/></td>
                            <td className="healer_consumes_mageblood center"><img src="https://assets.rpglogs.com/img/warcraft/abilities/inv_potion_45.jpg" width="24" height="24" alt="Mageblood Potion"/></td>
                            <td className="healer_consumes_flask center"><img src="https://assets.rpglogs.com/img/warcraft/abilities/inv_potion_97.jpg" width="24" height="24" alt="Flask of Distilled Wisdom"/></td>
                            <td className="healer_casts_started center">Start</td>
                            <td className="healer_casts_completed center">Finish</td>
                            <td className="healer_casts percent right">%</td>
                            <td className="healer_effective amount right">#</td>
                            <td className="healer_effective percent right">%</td>
                            <td className="healer_overheal amount right">#</td>
                            <td className="healer_overheal percent right">%</td>
                            <td className="healer_wasted amount right">#</td>
                            <td className="healer_wasted percent right">%</td>
                            <td className="healer_wasted amount right">Mana</td>
                        </tr>
                    </thead>
                    <tbody>
                {healers.sort((x,y) => y.summary.effectiveHeals - x.summary.effectiveHeals)
                        .map((x, idx) => (
                    <HealerFightSummary key={x.id} healer={x} row={idx} maxHeals={maxHeals} />
                ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="healer_name">Total</td>
                            <td className="healer_consumes_mana center">{healSummary.manaPots}</td>
                            <td className="healer_consumes_runes center">{healSummary.runes}</td>
                            <td className="healer_consumes_mageblood center" colSpan="2"></td>
                            <td className="right">{abbreviateNumber(healSummary.manaGained)}</td>
                            <td className="healer_cooldowns"></td>
                            <td className="healer_casts_started center">{healSummary.castsStarted}</td>
                            <td className="healer_casts_completed center">{healSummary.castsCompleted}</td>
                            <td className="healer_casts percent center">{healSummary.getCastsPercent()}%</td>
                            <td className="healer_amount">&nbsp;</td>
                            <td className="healer_effective amount right">{abbreviateNumber(healSummary.effectiveHeal)}</td>
                            <td className="healer_effective percent right">{healSummary.getEffectivePercent()}%</td>
                            <td className="healer_overheal amount right">{abbreviateNumber(healSummary.overHeal)}</td>
                            <td className="healer_overheal percent right">{healSummary.getOverhealPercent()}%</td>
                            <td className="healer_wasted amount right">{abbreviateNumber(healSummary.wastedHeals)}</td>
                            <td className="healer_wasted percent right">{healSummary.getWastedPercent()}%</td>
                            <td className="healer_wasted percent right">{abbreviateNumber(healSummary.wastedMana)}</td>
                        </tr>
                    </tfoot>
                </table>
            </>
            )
        }
        return (
            <div className={"fight " + (fight.kill ? "success" : "fail")}>
            <div className="heading" onClick={this.toggle}>{fight.name} {fight.kill ? "- Kill " : "- Wipe "}({msToTime(fight.end_time - fight.start_time)})</div>
            {expanded && details}
            </div>
        )
    }
}