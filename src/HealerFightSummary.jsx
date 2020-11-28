import {Component} from "react";
import {abbreviateNumber} from "./utils";
import {ProgressBar} from "./ProgressBar";

export class HealerFightSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mageBlood: false,
            flask: false,
            summary: props.healer.summary,
            spells: props.healer.spells,
            name: props.healer.name,
            id: props.healer.id,
            classType: props.healer.classType,
            isExpanded: false
        }

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            isExpanded: !this.state.isExpanded
        })
    }

    render() {
        const {id, name, classType, mageBlood, flask, summary, spells, isExpanded} = this.state;
        const {row, maxHeals} = this.props;

        let maxSpellHeals = spells.reduce((agg,obj) => {
            if (obj.summary.getTotalHeals() > agg) {
                agg = obj.summary.getTotalHeals();
            }
            return agg;
        }, 0);

        return (
            <>
                <tr key={id} className={classType + " character " + (row % 2 === 0 ? "even" : "odd")} onClick={this.toggle}>
                    <td className="healer_name">{name}</td>
                    <td className="healer_consumes_mana center">{summary.manaPots}</td>
                    <td className="healer_consumes_runes center">{summary.runes}</td>
                    <td className={"healer_consumes_mageblood center " + (mageBlood ? "tick" : "cross")}>{mageBlood ? "✔" : "✖"}</td>
                    <td className={"healer_consumes_flask center " + (flask ? "tick" : "cross")}>{flask ? "✔" : "✖"}</td>
                    <td className="right">{abbreviateNumber(summary.manaGained)}</td>
                    <td className="healer_cooldowns">
                        {summary.cooldowns.map((cooldown, idx) => (
                            <img key={idx} className="spell_icon" src={"https://assets.rpglogs.com/img/warcraft/abilities/" + cooldown.icon} alt={cooldown.name} />
                        ))}
                    </td>
                    <td className="healer_casts_started center">{summary.castsStarted}</td>
                    <td className="healer_casts_completed center">{summary.castsCompleted}</td>
                    <td className="healer_casts percent right">{summary.getCastsPercent()}%</td>
                    <td className="healer_amount">
                        <ProgressBar summary={summary} maxHeals={maxHeals} />
                    </td>
                    <td className="healer_effective amount right">{abbreviateNumber(summary.effectiveHeals)}</td>
                    <td className="healer_effective percent right">{summary.getEffectivePercent()}%</td>
                    <td className="healer_overheal amount right">{abbreviateNumber(summary.overHeal)}</td>
                    <td className="healer_overheal percent right">{summary.getOverhealPercent()}%</td>
                    <td className="healer_wasted amount right">{abbreviateNumber(summary.wastedHeals)}</td>
                    <td className="healer_wasted percent right">{summary.getWastedPercent()}%</td>
                    <td className="healer_wasted percent right">{abbreviateNumber(summary.wastedMana)}</td>
                </tr>

                {isExpanded && spells.sort((x,y) => y.summary.effectiveHeals -x.summary.effectiveHeals)
                                     .map((spell) => (
                    <tr key={spell.id} className={spell.type + " spell " + (row % 2 === 0 ? "even" : "odd")}>
                        <td className="healer_name" colSpan="7"><img className="spell_icon" src={"https://assets.rpglogs.com/img/warcraft/abilities/" + spell.icon} alt={spell.name} /> {spell.name}</td>
                        <td className="healer_casts_started center">{spell.summary.castsStarted}</td>
                        <td className="healer_casts_completed center">{spell.summary.castsCompleted}</td>
                        <td className="healer_casts percent right">{spell.summary.getCastsPercent()}%</td>
                        <td className="healer_amount">
                            <ProgressBar summary={spell.summary} maxHeals={maxSpellHeals} />
                        </td>
                        <td className="healer_effective amount right">{abbreviateNumber(spell.summary.effectiveHeals)}</td>
                        <td className="healer_effective percent right">{spell.summary.getEffectivePercent()}%</td>
                        <td className="healer_overheal amount right">{abbreviateNumber(spell.summary.overHeal)}</td>
                        <td className="healer_overheal percent right">{spell.summary.getOverhealPercent()}%</td>
                        <td className="healer_wasted amount right">{abbreviateNumber(spell.summary.wastedHeals)}</td>
                        <td className="healer_wasted percent right">{spell.summary.getWastedPercent()}%</td>
                        <td className="healer_wasted percent right">{abbreviateNumber(spell.summary.wastedMana)}</td>
                    </tr>
                ))}
            </>
        )
    }
}