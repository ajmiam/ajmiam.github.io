var SuperSkillShuffle;
(function (SuperSkillShuffle) {
    (function (SkillType) {
        SkillType[SkillType["BaseLevel1"] = 0] = "BaseLevel1";
        SkillType[SkillType["BaseLevel10"] = 1] = "BaseLevel10";
        SkillType[SkillType["PromotedLevel5"] = 2] = "PromotedLevel5";
        SkillType[SkillType["PromotedLevel15"] = 3] = "PromotedLevel15";
        SkillType[SkillType["EnemyOnly"] = 4] = "EnemyOnly";
        SkillType[SkillType["EnemyAndDlc"] = 5] = "EnemyAndDlc";
        SkillType[SkillType["DlcClass"] = 6] = "DlcClass";
        SkillType[SkillType["DlcItem"] = 7] = "DlcItem";
        SkillType[SkillType["Taker"] = 8] = "Taker";
        SkillType[SkillType["DlcClassAndTaker"] = 9] = "DlcClassAndTaker";
    })(SuperSkillShuffle.SkillType || (SuperSkillShuffle.SkillType = {}));
    var SkillType = SuperSkillShuffle.SkillType;
    (function (SkillPowerLevel) {
        SkillPowerLevel[SkillPowerLevel["WeakAndBoring"] = -4] = "WeakAndBoring";
        SkillPowerLevel[SkillPowerLevel["Boring"] = -3] = "Boring";
        SkillPowerLevel[SkillPowerLevel["Weak"] = -2] = "Weak";
        SkillPowerLevel[SkillPowerLevel["BorderlineWeak"] = -1] = "BorderlineWeak";
        SkillPowerLevel[SkillPowerLevel["Fair"] = 0] = "Fair";
        SkillPowerLevel[SkillPowerLevel["Powerful"] = 1] = "Powerful";
        SkillPowerLevel[SkillPowerLevel["Broken"] = 2] = "Broken";
        SkillPowerLevel[SkillPowerLevel["StaffSavant"] = 3] = "StaffSavant";
    })(SuperSkillShuffle.SkillPowerLevel || (SuperSkillShuffle.SkillPowerLevel = {}));
    var SkillPowerLevel = SuperSkillShuffle.SkillPowerLevel;
    var Skill = (function () {
        function Skill(name, ip, wt, st, spl) {
            var _this = this;
            // Returns an HTML depiction of the skill.  The HTML has raw text as its outside element, so it should
            // be wrapped in an element that the caller provides.
            this.ToHtml = function () {
                return _this.Name + " <img src='Content/Images/Skills" + _this.IconPath + "' />";
            };
            this.IsWeak = function () {
                return _this.SkillPowerLevel === SkillPowerLevel.Weak || _this.SkillPowerLevel === SkillPowerLevel.WeakAndBoring;
            };
            this.IsBoring = function () {
                return _this.SkillPowerLevel === SkillPowerLevel.Boring || _this.SkillPowerLevel === SkillPowerLevel.WeakAndBoring;
            };
            this.IsStandard = function () {
                return _this.SkillType <= 3;
            };
            this.IsEnemy = function () {
                return _this.SkillType === SkillType.EnemyAndDlc || _this.SkillType === SkillType.EnemyOnly;
            };
            this.IsDlc = function () {
                return _this.SkillType >= 5 && _this.SkillType <= 9;
            };
            this.Id = Skill.lastId;
            Skill.lastId++;
            this.Name = name;
            this.IconPath = ip;
            this.WeaponTypes = wt;
            this.SkillType = st;
            this.SkillPowerLevel = spl;
        }
        Skill.lastId = 0;
        Skill.GetAllSkills = function () {
            if (!Skill.allSkills) {
                Skill.initializeSkills();
            }
            return Skill.allSkills;
        };
        Skill.GetSkillByName = function (name) {
            if (!Skill.skillLookup) {
                Skill.initializeSkills();
            }
            return Skill.skillLookup[name];
        };
        Skill.initializeSkills = function () {
            Skill.allSkills = [];
            Skill.skillLookup = {};
            var add = function (name, iconPath, skillType, skillPowerLevel, weaponTypes) {
                if (skillPowerLevel === void 0) { skillPowerLevel = SkillPowerLevel.Fair; }
                if (weaponTypes === void 0) { weaponTypes = []; }
                var s = new Skill(name, iconPath, weaponTypes, skillType, skillPowerLevel);
                Skill.allSkills.push(s);
                Skill.skillLookup[s.Name] = s;
                return s;
            };
            //Begin adding the skills
            //Enemy skills
            add("Dragonskin", "dragonskin.png", SkillType.EnemyOnly, SkillPowerLevel.Broken);
            add("Divine Shield", "divine_shield.png", SkillType.EnemyOnly, SkillPowerLevel.Broken);
            add("Hit/Avo +10", "hit_avo_10.png", SkillType.EnemyOnly, SkillPowerLevel.Fair);
            add("Hit/Avo +20", "hit_avo_20.png", SkillType.EnemyOnly, SkillPowerLevel.Powerful);
            add("Resist Status", "resist_status.png", SkillType.EnemyOnly, SkillPowerLevel.Fair);
            add("Immune Status", "immune_status.png", SkillType.EnemyOnly, SkillPowerLevel.Powerful);
            add("Bold Stance", "bold_stance.png", SkillType.EnemyAndDlc, SkillPowerLevel.Fair);
            add("Point Blank", "point_blank.png", SkillType.EnemyAndDlc, SkillPowerLevel.Fair, [SuperSkillShuffle.WeaponType.Bow, SuperSkillShuffle.WeaponType.Ballista]);
            add("Winged Shield", "winged_shield.png", SkillType.EnemyAndDlc, SkillPowerLevel.Fair);
            add("Staff Savant", "staff_savant.png", SkillType.EnemyOnly, SkillPowerLevel.StaffSavant, [SuperSkillShuffle.WeaponType.Staff]);
            add("Immobilize", "immobilize.png", SkillType.EnemyOnly, SkillPowerLevel.Broken);
            add("Inevitable End", "inevitable_end.png", SkillType.EnemyOnly, SkillPowerLevel.Fair, [SuperSkillShuffle.WeaponType.Shuriken]);
            //Hoshidan skills
            add("Dragon Ward", "dragon_ward.png", SkillType.PromotedLevel5);
            add("Hoshidan Unity", "hoshidan_unity.png", SkillType.PromotedLevel15);
            add("Duelist's Blow", "duelists_blow.png", SkillType.BaseLevel1);
            add("Vantage", "vantage.png", SkillType.BaseLevel10);
            add("Astra", "astra.png", SkillType.PromotedLevel5);
            add("Swordfaire", "swordfaire.png", SkillType.PromotedLevel15, SkillPowerLevel.Fair, [SuperSkillShuffle.WeaponType.Sword]);
            add("Seal Strength", "seal_strength.png", SkillType.PromotedLevel5);
            add("Life and Death", "life_and_death.png", SkillType.PromotedLevel15);
            add("Seal Resistance", "seal_resistance.png", SkillType.BaseLevel1);
            add("Shove", "shove.png", SkillType.BaseLevel10, SkillPowerLevel.Weak);
            add("Death Blow", "death_blow.png", SkillType.PromotedLevel5);
            add("Counter", "counter.png", SkillType.PromotedLevel15);
            add("Salvage Blow", "salvage_blow.png", SkillType.PromotedLevel5);
            add("Lancebreaker", "lancebreaker.png", SkillType.PromotedLevel15);
            add("Seal Defense", "seal_defense.png", SkillType.BaseLevel1);
            add("Swap", "swap.png", SkillType.BaseLevel10, SkillPowerLevel.Weak);
            add("Seal Speed", "seal_speed.png", SkillType.PromotedLevel5);
            add("Lancefaire", "lancefaire.png", SkillType.PromotedLevel15, SkillPowerLevel.Fair, [SuperSkillShuffle.WeaponType.Lance]);
            add("Rend Heaven", "rend_heaven.png", SkillType.PromotedLevel5);
            add("Quixotic", "quixotic.png", SkillType.PromotedLevel15);
            add("Magic +2", "magic_2.png", SkillType.BaseLevel1, SkillPowerLevel.Boring, [SuperSkillShuffle.WeaponType.Dragonstone, SuperSkillShuffle.WeaponType.Staff, SuperSkillShuffle.WeaponType.Tome]);
            add("Future Sight", "future_sight.png", SkillType.BaseLevel10, SkillPowerLevel.Weak);
            add("Rally Magic", "rally_magic.png", SkillType.PromotedLevel5);
            add("Tomefaire", "tomefaire.png", SkillType.PromotedLevel15, SkillPowerLevel.Fair, [SuperSkillShuffle.WeaponType.Tome]);
            add("Miracle", "miracle.png", SkillType.BaseLevel1);
            add("Rally Luck", "rally_luck.png", SkillType.BaseLevel10);
            add("Renewal", "renewal.png", SkillType.PromotedLevel5);
            add("Countermagic", "countermagic.png", SkillType.PromotedLevel15);
            add("Darting Blow", "darting_blow.png", SkillType.BaseLevel1);
            add("Camaraderie", "camaraderie.png", SkillType.BaseLevel10);
            add("Rally Speed", "rally_speed.png", SkillType.PromotedLevel5);
            add("Warding Blow", "warding_blow.png", SkillType.PromotedLevel15);
            add("Air Superiority", "air_superiority.png", SkillType.PromotedLevel5);
            add("Amaterasu", "amaterasu.png", SkillType.PromotedLevel15);
            add("Skill +2", "skill_2.png", SkillType.BaseLevel1, SkillPowerLevel.WeakAndBoring);
            add("Quick Draw", "quick_draw.png", SkillType.BaseLevel10);
            add("Certain Blow", "certain_blow.png", SkillType.PromotedLevel5);
            add("Bowfaire", "bowfaire.png", SkillType.PromotedLevel15, SkillPowerLevel.Fair, [SuperSkillShuffle.WeaponType.Bow, SuperSkillShuffle.WeaponType.Ballista]);
            add("Locktouch", "locktouch.png", SkillType.BaseLevel1);
            add("Poison Strike", "poison_strike.png", SkillType.BaseLevel10);
            add("Lethality", "lethality.png", SkillType.PromotedLevel5);
            add("Shurikenfaire", "shurikenfaire.png", SkillType.PromotedLevel15, SkillPowerLevel.Fair, [SuperSkillShuffle.WeaponType.Shuriken]);
            add("Golembane", "golembane.png", SkillType.PromotedLevel5, SkillPowerLevel.Weak);
            add("Replicate", "replicate.png", SkillType.PromotedLevel15);
            add("Potent Potion", "potent_potion.png", SkillType.BaseLevel1);
            add("Quick Salve", "quick_salve.png", SkillType.BaseLevel10);
            add("Profiteer", "profiteer.png", SkillType.PromotedLevel5);
            add("Spendthrift", "spendthrift.png", SkillType.PromotedLevel15);
            add("Evenhanded", "evenhanded.png", SkillType.BaseLevel1);
            add("Beastbane", "beastbane.png", SkillType.BaseLevel10, SkillPowerLevel.Fair, [SuperSkillShuffle.WeaponType.Beaststone]);
            add("Even Better", "even_better.png", SkillType.PromotedLevel5);
            add("Grisly Wound", "grisly_wound.png", SkillType.PromotedLevel15);
            add("Luck +4", "luck_4.png", SkillType.BaseLevel1, SkillPowerLevel.WeakAndBoring);
            add("Inspiring Song", "inspiring_song.png", SkillType.BaseLevel10);
            add("Voice of Peace", "voice_of_peace.png", SkillType.PromotedLevel5);
            add("Foreign Princess", "foreign_princess.png", SkillType.PromotedLevel15);
            add("Aptitude", "aptitude.png", SkillType.BaseLevel1);
            add("Underdog", "underdog.png", SkillType.BaseLevel10);
            //Nohrian skills
            add("Nobility", "nobility.png", SkillType.BaseLevel1);
            add("Dragon Fang", "dragon_fang.png", SkillType.BaseLevel10);
            add("Draconic Hex", "draconic_hex.png", SkillType.PromotedLevel5);
            add("Nohrian Trust", "nohrian_trust.png", SkillType.PromotedLevel15);
            add("Elbow Room", "elbow_room.png", SkillType.BaseLevel1);
            add("Shelter", "shelter.png", SkillType.BaseLevel10);
            add("Defender", "defender.png", SkillType.PromotedLevel5);
            add("Aegis", "aegis.png", SkillType.PromotedLevel15);
            add("Luna", "luna.png", SkillType.PromotedLevel5);
            add("Armored Blow", "armored_blow.png", SkillType.PromotedLevel15);
            add("Defense +2", "defense_2.png", SkillType.BaseLevel1, SkillPowerLevel.Boring);
            add("Natural Cover", "natural_cover.png", SkillType.BaseLevel10);
            add("Wary Fighter", "wary_fighter.png", SkillType.PromotedLevel5);
            add("Pavise", "pavise.png", SkillType.PromotedLevel15);
            add("HP +5", "hp_5.png", SkillType.BaseLevel1, SkillPowerLevel.Boring);
            add("Gamble", "gamble.png", SkillType.BaseLevel10);
            add("Rally Strength", "rally_strength.png", SkillType.PromotedLevel5);
            add("Axefaire", "axefaire.png", SkillType.PromotedLevel15, SkillPowerLevel.Fair, [SuperSkillShuffle.WeaponType.Axe]);
            add("Good Fortune", "good_fortune.png", SkillType.BaseLevel1);
            add("Strong Riposte", "strong_riposte.png", SkillType.BaseLevel10);
            add("Sol", "sol.png", SkillType.PromotedLevel5);
            add("Axebreaker", "axebreaker.png", SkillType.PromotedLevel15);
            add("Rally Skill", "rally_skill.png", SkillType.PromotedLevel5);
            add("Shurikenbreaker", "shurikenbreaker.png", SkillType.PromotedLevel15);
            add("Movement +1", "mov_1.png", SkillType.BaseLevel10);
            add("Lucky Seven", "lucky_seven.png", SkillType.PromotedLevel5);
            add("Pass", "pass.png", SkillType.PromotedLevel15);
            add("Strength +2", "strength_2.png", SkillType.BaseLevel1, SkillPowerLevel.Boring, [SuperSkillShuffle.WeaponType.Axe, SuperSkillShuffle.WeaponType.Beaststone, SuperSkillShuffle.WeaponType.Bow, SuperSkillShuffle.WeaponType.Ballista, SuperSkillShuffle.WeaponType.Lance, SuperSkillShuffle.WeaponType.Shuriken, SuperSkillShuffle.WeaponType.Sword]);
            add("Lunge", "lunge.png", SkillType.BaseLevel10);
            add("Rally Defense", "rally_defense.png", SkillType.PromotedLevel5);
            add("Swordbreaker", "swordbreaker.png", SkillType.PromotedLevel15);
            add("Savage Blow", "savage_blow.png", SkillType.PromotedLevel5);
            add("Trample", "trample.png", SkillType.PromotedLevel15);
            add("Heartseeker", "heartseeker.png", SkillType.BaseLevel1);
            add("Malefic Aura", "malefic_aura.png", SkillType.BaseLevel10, SkillPowerLevel.Fair, [SuperSkillShuffle.WeaponType.Tome, SuperSkillShuffle.WeaponType.Dragonstone]);
            add("Vengeance", "vengeance.png", SkillType.PromotedLevel5);
            add("Bowbreaker", "bowbreaker.png", SkillType.PromotedLevel15);
            add("Seal Magic", "seal_magic.png", SkillType.PromotedLevel5);
            add("Lifetaker", "lifetaker.png", SkillType.PromotedLevel15);
            add("Resistance +2", "resistance_2.png", SkillType.BaseLevel1);
            add("Gentilhomme/Demoiselle", "gentilhomme.png", SkillType.BaseLevel10);
            add("Rally Resistance", "rally_resistance.png", SkillType.PromotedLevel5);
            add("Inspiration", "inspiration.png", SkillType.PromotedLevel15);
            add("Live To Serve", "live_to_serve.png", SkillType.PromotedLevel5, SkillPowerLevel.Fair, [SuperSkillShuffle.WeaponType.Staff]);
            add("Tomebreaker", "tomebreaker.png", SkillType.PromotedLevel15);
            add("Odd Shaped", "odd_shaped.png", SkillType.BaseLevel1);
            add("Better Odds", "better_odds.png", SkillType.PromotedLevel5);
            // DLC Class Skills
            add("Even Keel", "even_keel.png", SkillType.DlcClass);
            add("Iron Will", "iron_will.png", SkillType.DlcClass);
            add("Clarity", "clarity.png", SkillType.DlcClass);
            add("Aggressor", "aggressor.png", SkillType.DlcClass);
            add("Speed +2", "speed_2.png", SkillType.DlcClass);
            add("Relief", "relief.png", SkillType.DlcClass);
            add("Rally Movement", "rally_movement.png", SkillType.DlcClass);
            add("Galeforce", "galeforce.png", SkillType.DlcClass);
            add("Survey", "survey.png", SkillType.DlcClass, SkillPowerLevel.Fair, [SuperSkillShuffle.WeaponType.Ballista]);
            add("Opportunity Shot", "opportunity_shot.png", SkillType.DlcClass, SkillPowerLevel.Fair, [SuperSkillShuffle.WeaponType.Ballista]);
            add("Rifled Barrel", "rifled_barrel.png", SkillType.DlcClass, SkillPowerLevel.Fair, [SuperSkillShuffle.WeaponType.Ballista]);
            add("Surefooted", "surefooted.png", SkillType.DlcClass, SkillPowerLevel.Fair, [SuperSkillShuffle.WeaponType.Ballista]);
            add("Shadowgift", "shadowgift.png", SkillType.DlcClass, SkillPowerLevel.Fair, [SuperSkillShuffle.WeaponType.Tome]);
            add("Witch's Brew", "witchs_brew.png", SkillType.DlcClass);
            add("Warp", "warp.png", SkillType.DlcClass);
            add("Toxic Brew", "toxic_brew.png", SkillType.DlcClass);
            add("Dancing Blade", "dancing_blade.png", SkillType.DlcClass);
            add("Charm", "charm.png", SkillType.DlcClass);
            add("Dual Guarder", "dual_guarder.png", SkillType.DlcClass);
            add("Speedtaker", "speedtaker.png", SkillType.DlcClassAndTaker);
            add("Heavy Blade", "heavy_blade.png", SkillType.DlcClass, SkillPowerLevel.Fair, [SuperSkillShuffle.WeaponType.Axe, SuperSkillShuffle.WeaponType.Beaststone, SuperSkillShuffle.WeaponType.Bow, SuperSkillShuffle.WeaponType.Ballista, SuperSkillShuffle.WeaponType.Lance, SuperSkillShuffle.WeaponType.Shuriken, SuperSkillShuffle.WeaponType.Sword]);
            add("Veteran Intuition", "veteran_intuition.png", SkillType.DlcClass);
            add("Aether", "aether.png", SkillType.DlcClass);
            add("Strengthtaker", "strengthtaker.png", SkillType.DlcClassAndTaker, SkillPowerLevel.Fair, [SuperSkillShuffle.WeaponType.Axe, SuperSkillShuffle.WeaponType.Ballista, SuperSkillShuffle.WeaponType.Beaststone, SuperSkillShuffle.WeaponType.Bow, SuperSkillShuffle.WeaponType.Lance, SuperSkillShuffle.WeaponType.Shuriken, SuperSkillShuffle.WeaponType.Sword]);
            add("Dual Striker", "dual_striker.png", SkillType.DlcClass);
            add("Awakening", "awakening.png", SkillType.DlcClass);
            add("Tactical Advice", "tactical_advice.png", SkillType.DlcClass);
            add("Solidarity", "solidarity.png", SkillType.DlcClass);
            add("Ignis", "ignis.png", SkillType.DlcClass);
            add("Rally Spectrum", "rally_spectrum.png", SkillType.DlcClass);
            add("Rally Speed ", "rally_speed.png", SkillType.DlcClass);
            add("Warding Blow ", "warding_blow.png", SkillType.DlcClass);
            add("Paragon", "paragon.png", SkillType.DlcItem);
            add("Beast Shield", "beast_shield.png", SkillType.DlcItem);
            add("Armor Shield", "armor_shield.png", SkillType.DlcItem, SkillPowerLevel.Fair);
            // Taker skills
            add("Magictaker", "magictaker.png", SkillType.Taker, SkillPowerLevel.Fair, [SuperSkillShuffle.WeaponType.Dragonstone, SuperSkillShuffle.WeaponType.Tome, SuperSkillShuffle.WeaponType.Staff]);
            add("Skilltaker", "skilltaker.png", SkillType.Taker);
            add("Lucktaker", "lucktaker.png", SkillType.Taker);
            add("Defensetaker", "defensetaker.png", SkillType.Taker);
            add("Resistancetaker", "resistancetaker.png", SkillType.Taker);
        };
        return Skill;
    }());
    SuperSkillShuffle.Skill = Skill;
})(SuperSkillShuffle || (SuperSkillShuffle = {}));
//# sourceMappingURL=Skill.js.map