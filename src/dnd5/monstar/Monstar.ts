class Monstar {
    public name: string = ""
    public size: Size = Size.Medium
    public AC: Number = 0
    public speed: string = ""
    public type: string = ""
    public alignment: string = ""
    public damageImmunes: string = ""
    public conditionImmunes: string = ""
    public sence: string = ""
    public language: string = ""
    public challenges: string = ""
    public skills : Map<Skill,string> = new Map()
    // public skills : string = ""

    public hitPoint: Number = 0
    public imageUrl: string = ""

    public STR: Ability = new Ability()
    public DEX: Ability = new Ability()
    public CON: Ability = new Ability()
    public INT: Ability = new Ability()
    public WIS: Ability = new Ability()
    public CHA: Ability = new Ability()

    public treats: Array<TreatsAndAction> = []
    public actions: Array<TreatsAndAction> = []

    public regendaryAction: RegendaryAction | null = null

    public attacks : Array<Attack> = []

    public getSkill(skill : Skill) : string{
        const retVal = this.skills.get(skill)
        if(retVal){
            return retVal
        }else{
            throw new Error('unreached')
        }
    }
}

class Ability {
    constructor(value?: Number, modifier?: string, save?: string) {
        this.value = value ? value : 0
        this.modifier = modifier ? modifier : ""
        this.save = save ? save : "0"
    }

    public value: Number
    public modifier: string
    public save: string
}

class TreatsAndAction {
    constructor(name?: string) {
        this.name = name ? name : ""
    }
    public name: string
    public contents: Array<string> = []
}

class RegendaryAction {
    constructor(header: string, regendaryActionDetails: Array<TreatsAndAction>) {
        this.header = header
        this.regendaryActionDetails = regendaryActionDetails
    }
    public header: string = ""
    public regendaryActionDetails: Array<TreatsAndAction> = []
}

class Attack {
    public name : string = ""
    public attackRole : string = ""
    public damageRole : string = ""

    constructor(name:string,attackRole:string){
        this.name = name
        this.attackRole = attackRole
    }
}

enum Size {
    Tiny = 0.5,
    Small = 0.75,
    Medium = 1,
    Large = 2,
    Huge = 3,
    Gargantuan = 4,
}

enum Skill {
    History = "History",
    Perception = "Perception",
    Medicine= "Medicine",
    Religion= "Religion",
    Stealth= "Stealth",
    Persuasion= "Persuasion",
    Insight= "Insight",
    Deception= "Deception",
    Arcana= "Arcana",
    Athletics= "Athletics",
    Acrobatics= "Acrobatics",
    Survival= "Survival",
    Investigation= "Investigation",
    Nature= "Nature",
    Intimidation= "Intimidation",
    Performance= "Performance",
    Sleight= "Sleight of Hand",
    AnimalHandling= "AnimalHandling" //dead logic
}
export { Monstar, Ability, TreatsAndAction, Size,RegendaryAction,Attack,Skill }