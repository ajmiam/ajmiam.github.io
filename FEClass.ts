module SuperSkillShuffle
{
    export class SkillSlot
    {
        public Index: number;
        public AssignedSkill: Skill;
        public Class: FEClass;
        public Visible: boolean;

        public GetSkillLevel = (): number =>
        {
            if (!this.Class)
            {
                return null;
            }

            if (this.Class.GetPromotionLevel() === PromotionLevel.Promoted)
            {
                return (this.Index === 0) ? 5 : 15;
            }
            else
            {
                return (this.Index === 0) ? 1 :
                       (this.Index === 1) ? 10 :
                       (this.Index === 2) ? 25 :
                                            35;
            }
        }
    }
    
    export class FEClass
    {
        public Name: string;
        public WeaponTypes: WeaponType[];

        public BaseClasses: FEClass[];
        public PromotedClasses: FEClass[];

        public SkillSlots: SkillSlot[];

        public Id: number;
        private static lastId: number = 0;

        constructor(name: string, wt: WeaponType[])
        {
            this.Name = name;
            this.WeaponTypes = wt;

            this.SkillSlots = [];

            this.BaseClasses = [];
            this.PromotedClasses = [];

            this.Id = FEClass.lastId;
            FEClass.lastId++;
        }

        public AssignPromotedClass = (promotedClass: FEClass): void =>
        {
            promotedClass.BaseClasses.push(this);
            this.PromotedClasses.push(promotedClass);
        }

        public GetPromotionLevel = (): PromotionLevel =>
        {   
            if (this.PromotedClasses.length > 0)
            {
                return PromotionLevel.Base;
            }
            else if (this.BaseClasses.length > 0)
            {
                return PromotionLevel.Promoted;
            }
            else
            {
                return PromotionLevel.DoesNotPromote;
            }
        }

        public GetNumberOfSkillSlots = (): number =>
        {
            if (this.GetPromotionLevel() === PromotionLevel.DoesNotPromote)
            {
                return 4;
            }

            return 2;
        }

        public ToHtml = (): string =>
        {
            var result: string = "";
            return result;
        }

        private static allClasses: FEClass[];
        private static baseClasses: FEClass[];
        private static allClassesIncludingDlc: FEClass[];
        private static baseClassesIncludingDlc: FEClass[];
        private static classLookup: { [name: string]: FEClass };

        public static GetAllClasses = (): FEClass[] =>
        {
            if (!FEClass.allClasses || FEClass.allClasses.length === 0)
            {
                FEClass.initializeClasses();
            }

            return FEClass.allClasses;
        }

        public static GetBaseClasses = (): FEClass[] =>
        {
            if (!FEClass.baseClasses || FEClass.baseClasses.length === 0)
            {
                FEClass.initializeClasses();
            }

            return FEClass.baseClasses;
        }

        public static GetAllClassesIncludingDlc = (): FEClass[] =>
        {
            if (!FEClass.allClassesIncludingDlc || FEClass.allClassesIncludingDlc.length === 0)
            {
                FEClass.initializeClasses();
            }

            return FEClass.allClassesIncludingDlc;
        }

        public static GetBaseClassesIncludingDlc = (): FEClass[] =>
        {
            if (!FEClass.baseClassesIncludingDlc || FEClass.baseClassesIncludingDlc.length === 0)
            {
                FEClass.initializeClasses();
            }

            return FEClass.baseClassesIncludingDlc;
        }

        public static GetClassByName = (name: string): FEClass =>
        {
            if (!FEClass.classLookup)
            {
                FEClass.initializeClasses();
            }

            return FEClass.classLookup[name];
        }

        private static initializeClasses = (): void =>
        {
            FEClass.allClasses = [];
            FEClass.baseClasses = [];
            FEClass.classLookup = {};

            var dest: FEClass[] = FEClass.allClasses;
            var baseDest: FEClass[] = FEClass.baseClasses;

            var add = function (name: string, wt: WeaponType[]): FEClass
            {
                var c = new FEClass(name, wt);
                dest.push(c);
                FEClass.classLookup[c.Name] = c;

                return c;
            }

            var addAdv = function (name: string, wt: WeaponType[], baseClasses: FEClass[]): FEClass
            {
                
                var thisClass: FEClass = add(name, wt);
                baseClasses.forEach((baseClass: FEClass): void =>
                {
                    baseClass.AssignPromotedClass(thisClass);
                });

                return thisClass;
            }

            var tmp1: FEClass, tmp2: FEClass;

            // ----------------
            // Hoshidan Classes
            // ----------------

            // Nohrian Prince(ss) -> Hoshidan Noble, Nohr Noble
            tmp1 = add("Nohr Prince(ss)", [WeaponType.Sword, WeaponType.Dragonstone]);
            addAdv("Hoshido Noble", [WeaponType.Sword, WeaponType.Dragonstone, WeaponType.Staff], [tmp1]);
            addAdv("Nohr Noble", [WeaponType.Sword, WeaponType.Dragonstone, WeaponType.Tome], [tmp1]);

            // Samurai -> Swordmaster
            // Villager, Samurai -> Master of Arms
            tmp1 = add("Samurai", [WeaponType.Sword]);
            tmp2 = add("Villager", [WeaponType.Lance]);
            addAdv("Swordmaster", [WeaponType.Sword], [tmp1]);
            addAdv("Master of Arms", [WeaponType.Sword, WeaponType.Lance, WeaponType.Axe], [tmp1, tmp2]);
            // Villager, Apothecary -> Merchant
            tmp1 = add("Apothecary", [WeaponType.Bow]);
            addAdv("Merchant", [WeaponType.Bow, WeaponType.Lance], [tmp1, tmp2]);
            // Ninja, Apothecary -> Mechanist
            // Ninja -> Master Ninja
            tmp2 = add("Ninja", [WeaponType.Shuriken]);
            addAdv("Mechanist", [WeaponType.Shuriken, WeaponType.Bow], [tmp1, tmp2]);
            addAdv("Master Ninja", [WeaponType.Shuriken, WeaponType.Sword], [tmp2]);

            // Oni Savage -> Oni Chieftain, Blacksmith
            tmp1 = add("Oni Savage", [WeaponType.Axe]);
            addAdv("Oni Chieftain", [WeaponType.Axe, WeaponType.Tome], [tmp1]);
            addAdv("Blacksmith", [WeaponType.Axe, WeaponType.Sword], [tmp1]);

            //Spear Fighter -> Spear Master
            //Spear Fighter, Diviner -> Basara
            tmp1 = add("Spear Fighter", [WeaponType.Lance]);
            addAdv("Spear Master", [WeaponType.Lance], [tmp1]);
            tmp2 = add("Diviner", [WeaponType.Tome]);
            addAdv("Basara", [WeaponType.Tome, WeaponType.Lance], [tmp1, tmp2]);
            //Diviner, Monk/Shrine Maiden -> Onmyoji
            tmp1 = add("Monk/Shrine Maiden", [WeaponType.Staff]);
            addAdv("Onmyoji", [WeaponType.Tome, WeaponType.Staff], [tmp1, tmp2]);
            //Monk/Shrine Maiden -> Great Master/Priestess
            addAdv("Great Master/Priestess", [WeaponType.Staff], [tmp1]);

            //Sky Knight -> Falcon Knight
            //Sky Knight, Archer -> Kinshi Knight
            //Archer -> Sniper
            tmp1 = add("Sky Knight", [WeaponType.Lance]);
            addAdv("Falcon Knight", [WeaponType.Lance, WeaponType.Staff], [tmp1]);
            tmp2 = add("Archer", [WeaponType.Bow]);
            addAdv("Kinshi Knight", [WeaponType.Lance, WeaponType.Bow], [tmp1, tmp2]);
            addAdv("Sniper", [WeaponType.Bow], [tmp2]);

            //Kitsune -> Nine-Tails
            tmp1 = add("Kitsune", [WeaponType.Beaststone]);
            addAdv("Nine-Tails", [WeaponType.Beaststone], [tmp1]);

            //----------------
            // Nohrian Classes
            //----------------

            // Cavalier -> Paladin
            // Knight, Cavalier -> Great Knight
            // Knight -> General
            tmp1 = add("Cavalier", [WeaponType.Sword, WeaponType.Lance]);
            addAdv("Paladin", [WeaponType.Sword, WeaponType.Lance], [tmp1]);
            tmp2 = add("Knight", [WeaponType.Lance]);
            addAdv("Great Knight", [WeaponType.Sword, WeaponType.Lance, WeaponType.Axe], [tmp1, tmp2]);
            addAdv("General", [WeaponType.Lance, WeaponType.Axe], [tmp2]);

            // Fighter -> Berserker
            // Fighter, Mercenary -> Hero
            tmp1 = add("Fighter", [WeaponType.Axe]);
            addAdv("Berserker", [WeaponType.Axe], [tmp1]);
            tmp2 = add("Mercenary", [WeaponType.Sword]);
            addAdv("Hero", [WeaponType.Sword, WeaponType.Axe], [tmp1, tmp2]);
            // Mercenary, Outlaw -> Bow Knight
            // Outlaw -> Adventurer
            tmp1 = add("Outlaw", [WeaponType.Bow]);
            addAdv("Bow Knight", [WeaponType.Bow, WeaponType.Sword], [tmp1, tmp2]);
            addAdv("Adventurer", [WeaponType.Bow, WeaponType.Staff], [tmp1]);

            // Wyvern Rider -> Wyvern Lord, Malig Knight
            tmp1 = add("Wyvern Rider", [WeaponType.Axe]);
            addAdv("Wyvern Lord", [WeaponType.Axe, WeaponType.Lance], [tmp1]);
            addAdv("Malig Knight", [WeaponType.Axe, WeaponType.Tome], [tmp1]);

            // Dark Mage -> Sorcerer, Dark Knight
            tmp1 = add("Dark Mage", [WeaponType.Tome]);
            addAdv("Sorcerer", [WeaponType.Tome], [tmp1]);
            addAdv("Dark Knight", [WeaponType.Tome, WeaponType.Sword], [tmp1]);

            // Troubadour -> Strategist, Maid/Butler
            tmp1 = add("Troubadour", [WeaponType.Staff]);
            addAdv("Strategist", [WeaponType.Staff, WeaponType.Tome], [tmp1]);
            addAdv("Maid/Butler", [WeaponType.Staff, WeaponType.Shuriken], [tmp1]);

            // Wolfskin -> Wolfssegner
            tmp1 = add("Wolfskin", [WeaponType.Beaststone]);
            addAdv("Wolfssegner", [WeaponType.Beaststone], [tmp1]);

            //----------------
            // Neutral Classes
            //----------------
            add("Songstress", [WeaponType.Lance]);

            // Create the list of base classes
            FEClass.allClasses.forEach((c: FEClass): void =>
            {
                for (var i: number = 0; i < c.GetNumberOfSkillSlots(); i++)
                {
                    var ss: SkillSlot = new SkillSlot();
                    ss.AssignedSkill = null;
                    ss.Visible = false;
                    ss.Class = c;
                    ss.Index = i;
                    c.SkillSlots.push(ss);
                }

                var p: PromotionLevel = c.GetPromotionLevel();
                if (p === PromotionLevel.Base || p === PromotionLevel.DoesNotPromote)
                {
                    FEClass.baseClasses.push(c);
                }
            });

            // Now add DLC classes
            FEClass.allClassesIncludingDlc = FEClass.allClasses.map(x => x);
            FEClass.baseClassesIncludingDlc = FEClass.baseClasses.map(x => x);
            dest = FEClass.allClassesIncludingDlc;
            baseDest = FEClass.baseClassesIncludingDlc;

            baseDest.push(add("Dread Fighter", [WeaponType.Axe, WeaponType.Sword, WeaponType.Shuriken]));
            baseDest.push(add("Dark Falcon", [WeaponType.Tome, WeaponType.Lance]));
            baseDest.push(add("Ballistician", [WeaponType.Ballista]));
            baseDest.push(add("Witch", [WeaponType.Tome]));
            baseDest.push(add("Lodestar", [WeaponType.Sword]));
            baseDest.push(add("Vanguard", [WeaponType.Sword, WeaponType.Axe]));
            baseDest.push(add("Great Lord", [WeaponType.Sword, WeaponType.Lance]));
            baseDest.push(add("Grandmaster", [WeaponType.Tome, WeaponType.Sword]));
            baseDest.push(add("Pegasus Knight", [WeaponType.Lance]));

            dest.forEach((c: FEClass): void =>
            {
                if (c.SkillSlots.length === 0)
                {
                    for (var i: number = 0; i < c.GetNumberOfSkillSlots(); i++)
                    {
                        var ss: SkillSlot = new SkillSlot();
                        ss.AssignedSkill = null;
                        ss.Visible = false;
                        ss.Class = c;
                        ss.Index = i;
                        c.SkillSlots.push(ss);
                    }
                }
            });
        }
    }

    export enum PromotionLevel
    {
        Base,
        Promoted,
        DoesNotPromote
    }
}