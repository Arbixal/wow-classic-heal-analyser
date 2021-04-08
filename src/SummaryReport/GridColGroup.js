import {ExpandCollapseButton} from "./ExpandCollapseButton";

class Column {
    constructor(fieldName, displayName, visibilityFunction, cssClassName = "") {
        this.Field = fieldName;
        this.DisplayName = displayName;
        this.CssClassName = cssClassName;
        this.IsVisible = visibilityFunction;
    }

    GetHeader(context) {
        if (!this.IsVisible(context)) {
            return null;
        }

        return <th>{this.DisplayName}</th>
    }

    GetColumn(context) {
        if (!this.IsVisible(context)) {
            return null;
        }

        return <td className={this.CssClassName}>{context.Data[this.Field]}</td>
    }
}

class IconColumn extends Column {
    constructor(fieldName, displayName, iconName, visibilityFunction, cssClassName) {
        super(fieldName, displayName, visibilityFunction, cssClassName);

        this.IconUrl = "https://assets.rpglogs.com/img/warcraft/abilities/" + iconName;
    }

    GetHeader(context) {
        if (!this.IsVisible(context)) {
            return null;
        }

        return <th><img className="spell_icon" src={this.IconUrl} alt={this.DisplayName} data-tip={this.DisplayName} /></th>
    }
}

export class GridColGroup {
    constructor(name, visibilityFunction = (ctx) => true) {
        this.Name = name;
        this.VisibilityFunction = visibilityFunction;
        this.Columns = [];
        this.Expanded = true;

        this.handleToggle = this.handleToggle.bind(this);
    }

    handleToggle() {
        this.Expanded = !this.Expanded;
    }

    static Create(name, visibilityFunction = (ctx) => true) {
        return new GridColGroup(name, visibilityFunction);
    }

    AddColumn(fieldName, displayName = " ", visibilityFunction = (ctx) => true, cssClassName = "") {
        this.Columns.push(new Column(fieldName, displayName, visibilityFunction, cssClassName));

        return this;
    }

    AddIconColumn(fieldName, displayName = " ", iconName, visibilityFunction = (ctx) => true, cssClassName = "") {
        this.Columns.push(new IconColumn(fieldName, displayName, iconName, visibilityFunction, cssClassName));

        return this;
    }

    CanExpand() {
        return this.Columns.length > 1;
    }

    IsVisible(context) {
        if (!this.VisibilityFunction(context)) {
            return false;
        }

        return this.Columns.reduce((agg, obj) => {
            if (obj.IsVisible({...context, Expanded: this.Expanded})) {
                return true;
            }

            return agg;
        }, false);
    }

    GetColumnCount(context) {
        return this.Columns.reduce((agg, obj) => {
            if (obj.IsVisible({...context, Expanded: this.Expanded})) {
                agg++;
            }

            return agg;
        }, 0);
    }

    GetHeader(context) {
        if (!this.IsVisible(context)) {
            return null;
        }

        return <th colSpan={this.GetColumnCount({...context, Expanded: this.Expanded})}>{this.Name}{this.CanExpand() && <ExpandCollapseButton expanded={this.Expanded} onToggle={this.handleToggle} />}</th>
    }

    GetSubHeader(context) {
        if (!this.IsVisible(context)) {
            return null;
        }

        return this.Columns.map((col) => col.GetHeader({...context, Expanded: this.Expanded}));
    }

    GetColumns(context) {
        if (!this.IsVisible(context)) {
            return null;
        }

        return this.Columns.map((col) => col.GetColumn({...context, Expanded: this.Expanded}));
    }

    GetColumnsLoading(context) {
        if (!this.IsVisible(context)) {
            return null;
        }

        return this.Columns.map((col) => col.GetColumnLoading({...context, Expanded: this.Expanded}));
    }
}



/*
    let gridDefinition = [
        ColGroup.Create("Name")
            .AddColumn("Name"),
        ColGroup.Create("Enchants")
            .AddColumn("Enchants", null, null, "enchants"),
        ColGroup.Create("World Buffs")
            .AddColumn("WorldBuffCount", null, (ctx) => ctx.Expanded === false, "world_buff")
            .AddColumn("WorldBuffUptime", null, (ctx) => ctx.Expanded === false, "world_buff")
            .AddIconColumn("WorldBuffNef", "Rallying Cry of the Dragonslayer", "inv_misc_head_dragon_01.jpg", (ctx) => ctx.Expanded === true, "world_buff")
            .AddIconColumn("WorldBuffNef", "Rallying Cry of the Dragonslayer", "inv_misc_head_dragon_01.jpg", (ctx) => ctx.Expanded === true, "world_buff")

    ];
*/