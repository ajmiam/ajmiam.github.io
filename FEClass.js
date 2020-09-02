var SuperSkillShuffle;
(function (SuperSkillShuffle) {
    var SkillSlot = (function () {
        function SkillSlot() {
            var _this = this;
            this.GetSkillLevel = function () {
                if (!_this.Class) {
                    return null;
                }
                if (_this.Class.GetPromotionLevel() === PromotionLevel.Promoted) {
                    return (_this.Index === 0) ? 5 : 15;
                }
                else {
                    return (_this.Index === 0) ? 1 :
                        (_this.Index === 1) ? 10 :
                            (_this.Index === 2) ? 25 :
                                35;
                }
            };
        }
        return SkillSlot;
    }());
    SuperSkillShuffle.SkillSlot = SkillSlot;
    var FEClass = (function () {
        function FEClass(name, wt) {
            var _this = this;
            this.AssignPromotedClass = function (promotedClass) {
                promotedClass.BaseClasses.push(_this);
                _this.PromotedClasses.push(promotedClass);
            };
            this.GetPromotionLevel = function () {
                if (_this.PromotedClasses.length > 0) {
                    return PromotionLevel.Base;
                }
                else if (_this.BaseClasses.length > 0) {
                    return PromotionLevel.Promoted;
                }
                else {
                    return PromotionLevel.DoesNotPromote;
                }
            };
            this.GetNumberOfSkillSlots = function () {
                if (_this.GetPromotionLevel() === PromotionLevel.DoesNotPromote) {
                    return 4;
                }
                return 2;
            };
            this.ToHtml = function () {
                var result = "";
                return result;
            };
            this.Name = name;
            this.WeaponTypes = wt;
            this.SkillSlots = [];
            this.BaseClasses = [];
            this.PromotedClasses = [];
            this.Id = FEClass.lastId;
            FEClass.lastId++;
        }
        FEClass.lastId = 0;
        FEClass.GetAllClasses = function () {
            if (!FEClass.allClasses || FEClass.allClasses.length === 0) {
                FEClass.initializeClasses();
            }
            return FEClass.allClasses;
        };
        FEClass.GetBaseClasses = function () {
            if (!FEClass.baseClasses || FEClass.baseClasses.length === 0) {
                FEClass.initializeClasses();
            }
            return FEClass.baseClasses;
        };
        FEClass.GetAllClassesIncludingDlc = function () {
            if (!FEClass.allClassesIncludingDlc || FEClass.allClassesIncludingDlc.length === 0) {
                FEClass.initializeClasses();
            }
            return FEClass.allClassesIncludingDlc;
        };
        FEClass.GetBaseClassesIncludingDlc = function () {
            if (!FEClass.baseClassesIncludingDlc || FEClass.baseClassesIncludingDlc.length === 0) {
                FEClass.initializeClasses();
            }
            return FEClass.baseClassesIncludingDlc;
        };
        FEClass.GetClassByName = function (name) {
            if (!FEClass.classLookup) {
                FEClass.initializeClasses();
            }
            return FEClass.classLookup[name];
        };
        FEClass.initializeClasses = function () {
            FEClass.allClasses = [];
            FEClass.baseClasses = [];
            FEClass.classLookup = {};
            var dest = FEClass.allClasses;
            var baseDest = FEClass.baseClasses;
            var add = function (name, wt) {
                var c = new FEClass(name, wt);
                dest.push(c);
                FEClass.classLookup[c.Name] = c;
                return c;
            };
            var addAdv = function (name, wt, baseClasses) {
                var thisClass = add(name, wt);
                baseClasses.forEach(function (baseClass) {
                    baseClass.AssignPromotedClass(thisClass);
                });
                return thisClass;
            };
            var tmp1, tmp2;
            // ----------------
            // Hoshidan Classes
            // ----------------
            // Nohrian Prince(ss) -> Hoshidan Noble, Nohr Noble
            tmp1 = add("Nohr Prince(ss)", [SuperSkillShuffle.WeaponType.Sword, SuperSkillShuffle.WeaponType.Dragonstone]);
            addAdv("Hoshido Noble", [SuperSkillShuffle.WeaponType.Sword, SuperSkillShuffle.WeaponType.Dragonstone, SuperSkillShuffle.WeaponType.Staff], [tmp1]);
            addAdv("Nohr Noble", [SuperSkillShuffle.WeaponType.Sword, SuperSkillShuffle.WeaponType.Dragonstone, SuperSkillShuffle.WeaponType.Tome], [tmp1]);
            // Samurai -> Swordmaster
            // Villager, Samurai -> Master of Arms
            tmp1 = add("Samurai", [SuperSkillShuffle.WeaponType.Sword]);
            tmp2 = add("Villager", [SuperSkillShuffle.WeaponType.Lance]);
            addAdv("Swordmaster", [SuperSkillShuffle.WeaponType.Sword], [tmp1]);
            addAdv("Master of Arms", [SuperSkillShuffle.WeaponType.Sword, SuperSkillShuffle.WeaponType.Lance, SuperSkillShuffle.WeaponType.Axe], [tmp1, tmp2]);
            // Villager, Apothecary -> Merchant
            tmp1 = add("Apothecary", [SuperSkillShuffle.WeaponType.Bow]);
            addAdv("Merchant", [SuperSkillShuffle.WeaponType.Bow, SuperSkillShuffle.WeaponType.Lance], [tmp1, tmp2]);
            // Ninja, Apothecary -> Mechanist
            // Ninja -> Master Ninja
            tmp2 = add("Ninja", [SuperSkillShuffle.WeaponType.Shuriken]);
            addAdv("Mechanist", [SuperSkillShuffle.WeaponType.Shuriken, SuperSkillShuffle.WeaponType.Bow], [tmp1, tmp2]);
            addAdv("Master Ninja", [SuperSkillShuffle.WeaponType.Shuriken, SuperSkillShuffle.WeaponType.Sword], [tmp2]);
            // Oni Savage -> Oni Chieftain, Blacksmith
            tmp1 = add("Oni Savage", [SuperSkillShuffle.WeaponType.Axe]);
            addAdv("Oni Chieftain", [SuperSkillShuffle.WeaponType.Axe, SuperSkillShuffle.WeaponType.Tome], [tmp1]);
            addAdv("Blacksmith", [SuperSkillShuffle.WeaponType.Axe, SuperSkillShuffle.WeaponType.Sword], [tmp1]);
            //Spear Fighter -> Spear Master
            //Spear Fighter, Diviner -> Basara
            tmp1 = add("Spear Fighter", [SuperSkillShuffle.WeaponType.Lance]);
            addAdv("Spear Master", [SuperSkillShuffle.WeaponType.Lance], [tmp1]);
            tmp2 = add("Diviner", [SuperSkillShuffle.WeaponType.Tome]);
            addAdv("Basara", [SuperSkillShuffle.WeaponType.Tome, SuperSkillShuffle.WeaponType.Lance], [tmp1, tmp2]);
            //Diviner, Monk/Shrine Maiden -> Onmyoji
            tmp1 = add("Monk/Shrine Maiden", [SuperSkillShuffle.WeaponType.Staff]);
            addAdv("Onmyoji", [SuperSkillShuffle.WeaponType.Tome, SuperSkillShuffle.WeaponType.Staff], [tmp1, tmp2]);
            //Monk/Shrine Maiden -> Great Master/Priestess
            addAdv("Great Master/Priestess", [SuperSkillShuffle.WeaponType.Staff], [tmp1]);
            //Sky Knight -> Falcon Knight
            //Sky Knight, Archer -> Kinshi Knight
            //Archer -> Sniper
            tmp1 = add("Sky Knight", [SuperSkillShuffle.WeaponType.Lance]);
            addAdv("Falcon Knight", [SuperSkillShuffle.WeaponType.Lance, SuperSkillShuffle.WeaponType.Staff], [tmp1]);
            tmp2 = add("Archer", [SuperSkillShuffle.WeaponType.Bow]);
            addAdv("Kinshi Knight", [SuperSkillShuffle.WeaponType.Lance, SuperSkillShuffle.WeaponType.Bow], [tmp1, tmp2]);
            addAdv("Sniper", [SuperSkillShuffle.WeaponType.Bow], [tmp2]);
            //Kitsune -> Nine-Tails
            tmp1 = add("Kitsune", [SuperSkillShuffle.WeaponType.Beaststone]);
            addAdv("Nine-Tails", [SuperSkillShuffle.WeaponType.Beaststone], [tmp1]);
            //----------------
            // Nohrian Classes
            //----------------
            // Cavalier -> Paladin
            // Knight, Cavalier -> Great Knight
            // Knight -> General
            tmp1 = add("Cavalier", [SuperSkillShuffle.WeaponType.Sword, SuperSkillShuffle.WeaponType.Lance]);
            addAdv("Paladin", [SuperSkillShuffle.WeaponType.Sword, SuperSkillShuffle.WeaponType.Lance], [tmp1]);
            tmp2 = add("Knight", [SuperSkillShuffle.WeaponType.Lance]);
            addAdv("Great Knight", [SuperSkillShuffle.WeaponType.Sword, SuperSkillShuffle.WeaponType.Lance, SuperSkillShuffle.WeaponType.Axe], [tmp1, tmp2]);
            addAdv("General", [SuperSkillShuffle.WeaponType.Lance, SuperSkillShuffle.WeaponType.Axe], [tmp2]);
            // Fighter -> Berserker
            // Fighter, Mercenary -> Hero
            tmp1 = add("Fighter", [SuperSkillShuffle.WeaponType.Axe]);
            addAdv("Berserker", [SuperSkillShuffle.WeaponType.Axe], [tmp1]);
            tmp2 = add("Mercenary", [SuperSkillShuffle.WeaponType.Sword]);
            addAdv("Hero", [SuperSkillShuffle.WeaponType.Sword, SuperSkillShuffle.WeaponType.Axe], [tmp1, tmp2]);
            // Mercenary, Outlaw -> Bow Knight
            // Outlaw -> Adventurer
            tmp1 = add("Outlaw", [SuperSkillShuffle.WeaponType.Bow]);
            addAdv("Bow Knight", [SuperSkillShuffle.WeaponType.Bow, SuperSkillShuffle.WeaponType.Sword], [tmp1, tmp2]);
            addAdv("Adventurer", [SuperSkillShuffle.WeaponType.Bow, SuperSkillShuffle.WeaponType.Staff], [tmp1]);
            // Wyvern Rider -> Wyvern Lord, Malig Knight
            tmp1 = add("Wyvern Rider", [SuperSkillShuffle.WeaponType.Axe]);
            addAdv("Wyvern Lord", [SuperSkillShuffle.WeaponType.Axe, SuperSkillShuffle.WeaponType.Lance], [tmp1]);
            addAdv("Malig Knight", [SuperSkillShuffle.WeaponType.Axe, SuperSkillShuffle.WeaponType.Tome], [tmp1]);
            // Dark Mage -> Sorcerer, Dark Knight
            tmp1 = add("Dark Mage", [SuperSkillShuffle.WeaponType.Tome]);
            addAdv("Sorcerer", [SuperSkillShuffle.WeaponType.Tome], [tmp1]);
            addAdv("Dark Knight", [SuperSkillShuffle.WeaponType.Tome, SuperSkillShuffle.WeaponType.Sword], [tmp1]);
            // Troubadour -> Strategist, Maid/Butler
            tmp1 = add("Troubadour", [SuperSkillShuffle.WeaponType.Staff]);
            addAdv("Strategist", [SuperSkillShuffle.WeaponType.Staff, SuperSkillShuffle.WeaponType.Tome], [tmp1]);
            addAdv("Maid/Butler", [SuperSkillShuffle.WeaponType.Staff, SuperSkillShuffle.WeaponType.Shuriken], [tmp1]);
            // Wolfskin -> Wolfssegner
            tmp1 = add("Wolfskin", [SuperSkillShuffle.WeaponType.Beaststone]);
            addAdv("Wolfssegner", [SuperSkillShuffle.WeaponType.Beaststone], [tmp1]);
            //----------------
            // Neutral Classes
            //----------------
            add("Songstress", [SuperSkillShuffle.WeaponType.Lance]);
            // Create the list of base classes
            FEClass.allClasses.forEach(function (c) {
                for (var i = 0; i < c.GetNumberOfSkillSlots(); i++) {
                    var ss = new SkillSlot();
                    ss.AssignedSkill = null;
                    ss.Visible = false;
                    ss.Class = c;
                    ss.Index = i;
                    c.SkillSlots.push(ss);
                }
                var p = c.GetPromotionLevel();
                if (p === PromotionLevel.Base || p === PromotionLevel.DoesNotPromote) {
                    FEClass.baseClasses.push(c);
                }
            });
            // Now add DLC classes
            FEClass.allClassesIncludingDlc = FEClass.allClasses.map(function (x) { return x; });
            FEClass.baseClassesIncludingDlc = FEClass.baseClasses.map(function (x) { return x; });
            dest = FEClass.allClassesIncludingDlc;
            baseDest = FEClass.baseClassesIncludingDlc;
            baseDest.push(add("Dread Fighter", [SuperSkillShuffle.WeaponType.Axe, SuperSkillShuffle.WeaponType.Sword, SuperSkillShuffle.WeaponType.Shuriken]));
            baseDest.push(add("Dark Falcon", [SuperSkillShuffle.WeaponType.Tome, SuperSkillShuffle.WeaponType.Lance]));
            baseDest.push(add("Ballistician", [SuperSkillShuffle.WeaponType.Ballista]));
            baseDest.push(add("Witch", [SuperSkillShuffle.WeaponType.Tome]));
            baseDest.push(add("Lodestar", [SuperSkillShuffle.WeaponType.Sword]));
            baseDest.push(add("Vanguard", [SuperSkillShuffle.WeaponType.Sword, SuperSkillShuffle.WeaponType.Axe]));
            baseDest.push(add("Great Lord", [SuperSkillShuffle.WeaponType.Sword, SuperSkillShuffle.WeaponType.Lance]));
            baseDest.push(add("Grandmaster", [SuperSkillShuffle.WeaponType.Tome, SuperSkillShuffle.WeaponType.Sword]));
            baseDest.push(add("Pegasus Knight", [SuperSkillShuffle.WeaponType.Lance]));
            dest.forEach(function (c) {
                if (c.SkillSlots.length === 0) {
                    for (var i = 0; i < c.GetNumberOfSkillSlots(); i++) {
                        var ss = new SkillSlot();
                        ss.AssignedSkill = null;
                        ss.Visible = false;
                        ss.Class = c;
                        ss.Index = i;
                        c.SkillSlots.push(ss);
                    }
                }
            });
        };
        return FEClass;
    }());
    SuperSkillShuffle.FEClass = FEClass;
    (function (PromotionLevel) {
        PromotionLevel[PromotionLevel["Base"] = 0] = "Base";
        PromotionLevel[PromotionLevel["Promoted"] = 1] = "Promoted";
        PromotionLevel[PromotionLevel["DoesNotPromote"] = 2] = "DoesNotPromote";
    })(SuperSkillShuffle.PromotionLevel || (SuperSkillShuffle.PromotionLevel = {}));
    var PromotionLevel = SuperSkillShuffle.PromotionLevel;
})(SuperSkillShuffle || (SuperSkillShuffle = {}));
//# sourceMappingURL=FEClass.js.map