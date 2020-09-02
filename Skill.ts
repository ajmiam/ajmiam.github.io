module SuperSkillShuffle
{
    export enum SkillType
    {
        BaseLevel1 = 0,
        BaseLevel10 = 1,
        PromotedLevel5 = 2,
        PromotedLevel15 = 3,
        EnemyOnly = 4,
        EnemyAndDlc = 5,
        DlcClass = 6,
        DlcItem = 7,
        Taker = 8,
        DlcClassAndTaker = 9
    }

    export enum SkillPowerLevel
    {
        WeakAndBoring = -4,
        Boring = -3,
        Weak = -2,
        BorderlineWeak = -1,
        Fair = 0,
        Powerful = 1,
        Broken = 2,
        StaffSavant = 3
    }

    export class Skill
    {
        private static lastId = 0;

        public Id: number;
        public Name: string;
        public IconPath: string;
        public WeaponTypes: WeaponType[];
        public SkillType: SkillType;
        public SkillPowerLevel: SkillPowerLevel;
        constructor(name: string, ip: string, wt: WeaponType[], st: SkillType, spl: SkillPowerLevel)
        {
            this.Id = Skill.lastId;
            Skill.lastId++;

            this.Name = name;
            this.IconPath = ip;
            this.WeaponTypes = wt;
            this.SkillType = st;
            this.SkillPowerLevel = spl;
        }

        public static SkillList: Skill[];

        // Returns an HTML depiction of the skill.  The HTML has raw text as its outside element, so it should
        // be wrapped in an element that the caller provides.
        public ToHtml = (): string =>
        {
            return this.Name + " <img src='Content/Images/Skills" + this.IconPath + "' />";
        }

        public IsWeak = (): boolean =>
        {
            return this.SkillPowerLevel === SkillPowerLevel.Weak || this.SkillPowerLevel === SkillPowerLevel.WeakAndBoring;
        }

        public IsBoring = (): boolean =>
        {
            return this.SkillPowerLevel === SkillPowerLevel.Boring || this.SkillPowerLevel === SkillPowerLevel.WeakAndBoring;
        }

        public IsStandard = (): boolean =>
        {
            return this.SkillType <= 3;
        }

        public IsEnemy = (): boolean =>
        {
            return this.SkillType === SkillType.EnemyAndDlc || this.SkillType === SkillType.EnemyOnly;
        }

        public IsDlc = (): boolean =>
        {
            return this.SkillType >= 5 && this.SkillType <= 9;
        }

        private static allSkills: Skill[];
        private static skillLookup: { [name: string]: Skill };

        public static GetAllSkills = (): Skill[] =>
        {
            if (!Skill.allSkills)
            {
                Skill.initializeSkills();
            }

            return Skill.allSkills;
        }

        public static GetSkillByName = (name: string): Skill =>
        {
            if (!Skill.skillLookup)
            {
                Skill.initializeSkills();
            }

            return Skill.skillLookup[name];
        }

        private static initializeSkills = (): void =>
        {
            Skill.allSkills = [];
            Skill.skillLookup = {};
            var add = function (
                name: string,
                iconPath: string,
                skillType: SkillType,
                skillPowerLevel: SkillPowerLevel = SkillPowerLevel.Fair,
                weaponTypes: WeaponType[] = []
            ): Skill
            {
                var s: Skill = new Skill(name, iconPath, weaponTypes, skillType, skillPowerLevel);
                Skill.allSkills.push(s);
                Skill.skillLookup[s.Name] = s;
                return s;
            }

			// For this skill list I am adding the skill IDs in comments every so often for readability.
			// These are ONLY the skill IDs used by this program,
			// NOT the ones in the actual game!
			// A skill ID is above the skill with that ID, so for example:
			// 0 is Dragonskin, 4 is Resist Status, 5 is Immune Status, and so on.

            //Begin adding the skills
            //Enemy skills
			// 0
            add("Dragonskin", "dragonskin.png", SkillType.EnemyOnly, SkillPowerLevel.Broken);
            add("Divine Shield", "divine_shield.png", SkillType.EnemyOnly, SkillPowerLevel.Broken);
            add("Hit/Avo +10", "hit_avo_10.png", SkillType.EnemyOnly, SkillPowerLevel.Fair);
            add("Hit/Avo +20", "hit_avo_20.png", SkillType.EnemyOnly, SkillPowerLevel.Powerful);
            add("Resist Status", "resist_status.png", SkillType.EnemyOnly, SkillPowerLevel.Fair);
			// 5
            add("Immune Status", "immune_status.png", SkillType.EnemyOnly, SkillPowerLevel.Powerful);
            add("Bold Stance", "bold_stance.png", SkillType.EnemyAndDlc, SkillPowerLevel.Fair);
            add("Point Blank", "point_blank.png", SkillType.EnemyAndDlc, SkillPowerLevel.Fair, [WeaponType.Bow, WeaponType.Ballista]);
            add("Winged Shield", "winged_shield.png", SkillType.EnemyAndDlc, SkillPowerLevel.Fair);
            add("Staff Savant", "staff_savant.png", SkillType.EnemyOnly, SkillPowerLevel.StaffSavant, [WeaponType.Staff]);
			// 10
            add("Immobilize", "immobilize.png", SkillType.EnemyOnly, SkillPowerLevel.Broken);
            add("Inevitable End", "inevitable_end.png", SkillType.EnemyOnly, SkillPowerLevel.Fair, [WeaponType.Shuriken]);

            //Hoshidan skills
            add("Dragon Ward", "dragon_ward.png", SkillType.PromotedLevel5);
            add("Hoshidan Unity", "hoshidan_unity.png", SkillType.PromotedLevel15);
            add("Duelist's Blow", "duelists_blow.png", SkillType.BaseLevel1);
			// 15
            add("Vantage", "vantage.png", SkillType.BaseLevel10);
            add("Astra", "astra.png", SkillType.PromotedLevel5);
            add("Swordfaire", "swordfaire.png", SkillType.PromotedLevel15, SkillPowerLevel.Fair, [WeaponType.Sword]);
            add("Seal Strength", "seal_strength.png", SkillType.PromotedLevel5);
            add("Life and Death", "life_and_death.png", SkillType.PromotedLevel15);
			// 20
            add("Seal Resistance", "seal_resistance.png", SkillType.BaseLevel1);
            add("Shove", "shove.png", SkillType.BaseLevel10, SkillPowerLevel.Weak);
            add("Death Blow", "death_blow.png", SkillType.PromotedLevel5);
            add("Counter", "counter.png", SkillType.PromotedLevel15);
            add("Salvage Blow", "salvage_blow.png", SkillType.PromotedLevel5);
			// 25
            add("Lancebreaker", "lancebreaker.png", SkillType.PromotedLevel15);
            add("Seal Defense", "seal_defense.png", SkillType.BaseLevel1);
            add("Swap", "swap.png", SkillType.BaseLevel10, SkillPowerLevel.Weak);
            add("Seal Speed", "seal_speed.png", SkillType.PromotedLevel5);
            add("Lancefaire", "lancefaire.png", SkillType.PromotedLevel15, SkillPowerLevel.Fair, [WeaponType.Lance]);
			// 30
            add("Rend Heaven", "rend_heaven.png", SkillType.PromotedLevel5);
            add("Quixotic", "quixotic.png", SkillType.PromotedLevel15);
            add("Magic +2", "magic_2.png", SkillType.BaseLevel1, SkillPowerLevel.Boring, [WeaponType.Dragonstone, WeaponType.Staff, WeaponType.Tome]);
            add("Future Sight", "future_sight.png", SkillType.BaseLevel10, SkillPowerLevel.Weak);
            add("Rally Magic", "rally_magic.png", SkillType.PromotedLevel5);
			// 35
            add("Tomefaire", "tomefaire.png", SkillType.PromotedLevel15, SkillPowerLevel.Fair, [WeaponType.Tome]);
            add("Miracle", "miracle.png", SkillType.BaseLevel1);
            add("Rally Luck", "rally_luck.png", SkillType.BaseLevel10);
            add("Renewal", "renewal.png", SkillType.PromotedLevel5);
            add("Countermagic", "countermagic.png", SkillType.PromotedLevel15);
			// 40
            add("Darting Blow", "darting_blow.png", SkillType.BaseLevel1);
            add("Camaraderie", "camaraderie.png", SkillType.BaseLevel10);
            add("Rally Speed", "rally_speed.png", SkillType.PromotedLevel5);
            add("Warding Blow", "warding_blow.png", SkillType.PromotedLevel15);
            add("Air Superiority", "air_superiority.png", SkillType.PromotedLevel5);
			// 45
            add("Amaterasu", "amaterasu.png", SkillType.PromotedLevel15);
            add("Skill +2", "skill_2.png", SkillType.BaseLevel1, SkillPowerLevel.WeakAndBoring);
            add("Quick Draw", "quick_draw.png", SkillType.BaseLevel10);
            add("Certain Blow", "certain_blow.png", SkillType.PromotedLevel5);
            add("Bowfaire", "bowfaire.png", SkillType.PromotedLevel15, SkillPowerLevel.Fair, [WeaponType.Bow, WeaponType.Ballista]);
			// 50
            add("Locktouch", "locktouch.png", SkillType.BaseLevel1);
            add("Poison Strike", "poison_strike.png", SkillType.BaseLevel10);
            add("Lethality", "lethality.png", SkillType.PromotedLevel5);
            add("Shurikenfaire", "shurikenfaire.png", SkillType.PromotedLevel15, SkillPowerLevel.Fair, [WeaponType.Shuriken]);
            add("Golembane", "golembane.png", SkillType.PromotedLevel5, SkillPowerLevel.Weak);
			// 55
            add("Replicate", "replicate.png", SkillType.PromotedLevel15);
            add("Potent Potion", "potent_potion.png", SkillType.BaseLevel1);
            add("Quick Salve", "quick_salve.png", SkillType.BaseLevel10);
            add("Profiteer", "profiteer.png", SkillType.PromotedLevel5);
            add("Spendthrift", "spendthrift.png", SkillType.PromotedLevel15);
			// 60
            add("Evenhanded", "evenhanded.png", SkillType.BaseLevel1);
            add("Beastbane", "beastbane.png", SkillType.BaseLevel10, SkillPowerLevel.Fair, [WeaponType.Beaststone]);
            add("Even Better", "even_better.png", SkillType.PromotedLevel5);
            add("Grisly Wound", "grisly_wound.png", SkillType.PromotedLevel15);
            add("Luck +4", "luck_4.png", SkillType.BaseLevel1, SkillPowerLevel.WeakAndBoring);
			// 65
            add("Inspiring Song", "inspiring_song.png", SkillType.BaseLevel10);
            add("Voice of Peace", "voice_of_peace.png", SkillType.PromotedLevel5);
            add("Foreign Princess", "foreign_princess.png", SkillType.PromotedLevel15);
            add("Aptitude", "aptitude.png", SkillType.BaseLevel1);
            add("Underdog", "underdog.png", SkillType.BaseLevel10);

            //Nohrian skills
			// 70
            add("Nobility", "nobility.png", SkillType.BaseLevel1);
            add("Dragon Fang", "dragon_fang.png", SkillType.BaseLevel10);
            add("Draconic Hex", "draconic_hex.png", SkillType.PromotedLevel5);
            add("Nohrian Trust", "nohrian_trust.png", SkillType.PromotedLevel15);
            add("Elbow Room", "elbow_room.png", SkillType.BaseLevel1);
			// 75
            add("Shelter", "shelter.png", SkillType.BaseLevel10);
            add("Defender", "defender.png", SkillType.PromotedLevel5);
            add("Aegis", "aegis.png", SkillType.PromotedLevel15);
            add("Luna", "luna.png", SkillType.PromotedLevel5);
            add("Armored Blow", "armored_blow.png", SkillType.PromotedLevel15);
			// 80
            add("Defense +2", "defense_2.png", SkillType.BaseLevel1, SkillPowerLevel.Boring);
            add("Natural Cover", "natural_cover.png", SkillType.BaseLevel10);
            add("Wary Fighter", "wary_fighter.png", SkillType.PromotedLevel5);
            add("Pavise", "pavise.png", SkillType.PromotedLevel15);
            add("HP +5", "hp_5.png", SkillType.BaseLevel1, SkillPowerLevel.Boring);
            // 85
			add("Gamble", "gamble.png", SkillType.BaseLevel10);
            add("Rally Strength", "rally_strength.png", SkillType.PromotedLevel5);
            add("Axefaire", "axefaire.png", SkillType.PromotedLevel15, SkillPowerLevel.Fair, [WeaponType.Axe]);
            add("Good Fortune", "good_fortune.png", SkillType.BaseLevel1);
            add("Strong Riposte", "strong_riposte.png", SkillType.BaseLevel10);
            // 90
			add("Sol", "sol.png", SkillType.PromotedLevel5);
            add("Axebreaker", "axebreaker.png", SkillType.PromotedLevel15);
            add("Rally Skill", "rally_skill.png", SkillType.PromotedLevel5);
            add("Shurikenbreaker", "shurikenbreaker.png", SkillType.PromotedLevel15);
            add("Movement +1", "mov_1.png", SkillType.BaseLevel10);
            // 95
			add("Lucky Seven", "lucky_seven.png", SkillType.PromotedLevel5);
            add("Pass", "pass.png", SkillType.PromotedLevel15);
            add("Strength +2", "strength_2.png", SkillType.BaseLevel1, SkillPowerLevel.Boring, [WeaponType.Axe, WeaponType.Beaststone, WeaponType.Bow, WeaponType.Ballista, WeaponType.Lance, WeaponType.Shuriken, WeaponType.Sword]);
            add("Lunge", "lunge.png", SkillType.BaseLevel10);
            add("Rally Defense", "rally_defense.png", SkillType.PromotedLevel5);
            // 100
			add("Swordbreaker", "swordbreaker.png", SkillType.PromotedLevel15);
            add("Savage Blow", "savage_blow.png", SkillType.PromotedLevel5);
            add("Trample", "trample.png", SkillType.PromotedLevel15);
            add("Heartseeker", "heartseeker.png", SkillType.BaseLevel1);
            add("Malefic Aura", "malefic_aura.png", SkillType.BaseLevel10, SkillPowerLevel.Fair, [WeaponType.Tome, WeaponType.Dragonstone]);
            // 105
			add("Vengeance", "vengeance.png", SkillType.PromotedLevel5);
            add("Bowbreaker", "bowbreaker.png", SkillType.PromotedLevel15);
            add("Seal Magic", "seal_magic.png", SkillType.PromotedLevel5);
            add("Lifetaker", "lifetaker.png", SkillType.PromotedLevel15);
            add("Resistance +2", "resistance_2.png", SkillType.BaseLevel1);
            // 110
			add("Gentilhomme/Demoiselle", "gentilhomme.png", SkillType.BaseLevel10);
            add("Rally Resistance", "rally_resistance.png", SkillType.PromotedLevel5);
            add("Inspiration", "inspiration.png", SkillType.PromotedLevel15);
            add("Live To Serve", "live_to_serve.png", SkillType.PromotedLevel5, SkillPowerLevel.Fair, [WeaponType.Staff]);
            add("Tomebreaker", "tomebreaker.png", SkillType.PromotedLevel15);
            // 115
			add("Odd Shaped", "odd_shaped.png", SkillType.BaseLevel1);
            add("Better Odds", "better_odds.png", SkillType.PromotedLevel5);

            // DLC Class Skills
            add("Even Keel", "even_keel.png", SkillType.DlcClass);
            add("Iron Will", "iron_will.png", SkillType.DlcClass);
            add("Clarity", "clarity.png", SkillType.DlcClass);
            // 120
			add("Aggressor", "aggressor.png", SkillType.DlcClass);
            add("Speed +2", "speed_2.png", SkillType.DlcClass);
            add("Relief", "relief.png", SkillType.DlcClass);
            add("Rally Movement", "rally_movement.png", SkillType.DlcClass);
            add("Galeforce", "galeforce.png", SkillType.DlcClass);
            // 125
			add("Survey", "survey.png", SkillType.DlcClass, SkillPowerLevel.Fair, [WeaponType.Ballista]);
            add("Opportunity Shot", "opportunity_shot.png", SkillType.DlcClass, SkillPowerLevel.Fair, [WeaponType.Ballista]);
            add("Rifled Barrel", "rifled_barrel.png", SkillType.DlcClass, SkillPowerLevel.Fair, [WeaponType.Ballista]);
            add("Surefooted", "surefooted.png", SkillType.DlcClass, SkillPowerLevel.Fair, [WeaponType.Ballista]);
            add("Shadowgift", "shadowgift.png", SkillType.DlcClass, SkillPowerLevel.Fair, [WeaponType.Tome]);
            // 130
			add("Witch's Brew", "witchs_brew.png", SkillType.DlcClass);
            add("Warp", "warp.png", SkillType.DlcClass);
            add("Toxic Brew", "toxic_brew.png", SkillType.DlcClass);
            add("Dancing Blade", "dancing_blade.png", SkillType.DlcClass);
            add("Charm", "charm.png", SkillType.DlcClass);
            // 135
			add("Dual Guarder", "dual_guarder.png", SkillType.DlcClass);
            add("Speedtaker", "speedtaker.png", SkillType.DlcClassAndTaker);
            add("Heavy Blade", "heavy_blade.png", SkillType.DlcClass, SkillPowerLevel.Fair, [WeaponType.Axe, WeaponType.Beaststone, WeaponType.Bow, WeaponType.Ballista, WeaponType.Lance, WeaponType.Shuriken, WeaponType.Sword]);
            add("Veteran Intuition", "veteran_intuition.png", SkillType.DlcClass);
            add("Aether", "aether.png", SkillType.DlcClass);
			// 140
            add("Strengthtaker", "strengthtaker.png", SkillType.DlcClassAndTaker, SkillPowerLevel.Fair, [WeaponType.Axe, WeaponType.Ballista, WeaponType.Beaststone, WeaponType.Bow, WeaponType.Lance, WeaponType.Shuriken, WeaponType.Sword]);
            add("Dual Striker", "dual_striker.png", SkillType.DlcClass);
            add("Awakening", "awakening.png", SkillType.DlcClass);
            add("Tactical Advice", "tactical_advice.png", SkillType.DlcClass);
            add("Solidarity", "solidarity.png", SkillType.DlcClass);
            // 145
			add("Ignis", "ignis.png", SkillType.DlcClass);
            add("Rally Spectrum", "rally_spectrum.png", SkillType.DlcClass);
            add("Rally Speed ", "rally_speed.png", SkillType.DlcClass);
            add("Warding Blow ", "warding_blow.png", SkillType.DlcClass);
            add("Paragon", "paragon.png", SkillType.DlcItem);
            // 150
			add("Beast Shield", "beast_shield.png", SkillType.DlcItem);
            add("Armor Shield", "armor_shield.png", SkillType.DlcItem, SkillPowerLevel.Fair);

            // Taker skills
            add("Magictaker", "magictaker.png", SkillType.Taker, SkillPowerLevel.Fair, [WeaponType.Dragonstone, WeaponType.Tome, WeaponType.Staff]);
            add("Skilltaker", "skilltaker.png", SkillType.Taker);
            add("Lucktaker", "lucktaker.png", SkillType.Taker);
			// 155
            add("Defensetaker", "defensetaker.png", SkillType.Taker);
            add("Resistancetaker", "resistancetaker.png", SkillType.Taker);
        }
    }
}