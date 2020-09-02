var SuperSkillShuffle;
(function (SuperSkillShuffle) {
    var SkillShuffler = (function () {
        function SkillShuffler(shuffleOptions) {
            var _this = this;
            // Determines if a skill is eligible to be included in the shuffle
            // according to the chosen options.  Returns true if so, false if not.
            this.TestSkillEligible = function (s) {
                // If the skill is constant, it was already assigned, so don't assign it again.
                if (_this.constantSkills.indexOf(s) >= 0) {
                    return false;
                }
                // Exclude skills marked as "weak" if the option was chosen.
                if (_this.ChosenShuffleOptions.ExcludeWeakSkills && s.IsWeak()) {
                    return false;
                }
                // Ballista-only skils are useless without the Ballista class existing!
                if ((_this.ChosenShuffleOptions.UseDlc !== DLCOption.All) && (s.WeaponTypes.length === 1 && s.WeaponTypes[0] === SuperSkillShuffle.WeaponType.Ballista)) {
                    return false;
                }
                // All other "standard" type skills are allowed.
                if (s.IsStandard()) {
                    return true;
                }
                // DLC skills may be allowed or not, depending on user settings
                if (s.IsDlc() && !(s.SkillType === SuperSkillShuffle.SkillType.Taker) && _this.ChosenShuffleOptions.UseDlc !== DLCOption.None) {
                    if (s.SkillType === SuperSkillShuffle.SkillType.DlcClassAndTaker) {
                        return (_this.ChosenShuffleOptions.UseDlc === DLCOption.All) || _this.ChosenShuffleOptions.IncludeTakers;
                    }
                    return true;
                }
                // "Stattaker" skills also get a separate setting
                if (s.SkillType === SuperSkillShuffle.SkillType.Taker && _this.ChosenShuffleOptions.IncludeTakers) {
                    return true;
                }
                // Enemy skills depend on the user's settings.
                if (s.IsEnemy()) {
                    // Staff Savant gets its own option
                    if (s.SkillPowerLevel === SuperSkillShuffle.SkillPowerLevel.StaffSavant) {
                        return _this.ChosenShuffleOptions.IncludeStaffSavant;
                    }
                    else {
                        return s.SkillPowerLevel <= _this.ChosenShuffleOptions.MaximumSkillPowerLevel;
                    }
                }
                return false;
            };
            this.AssignSkills = function () {
                var attempts = 0;
                do {
                    attempts++;
                    _this.ClearSkills();
                    // Assign the skills that are constant in every shuffle.
                    _this.assignNecessarySkills();
                    // Determine which of the remaining skills are eligible based on the user's settings.
                    _this.eligibleSkills = SuperSkillShuffle.Skill.GetAllSkills().map(function (s) { return s; });
                    // Push duplicates of the skills that appear in two classes.
                    _this.eligibleSkills.push(SuperSkillShuffle.Skill.GetSkillByName("Aether"));
                    _this.eligibleSkills.push(SuperSkillShuffle.Skill.GetSkillByName("Charm"));
                    _this.eligibleSkills.push(SuperSkillShuffle.Skill.GetSkillByName("Beastbane"));
                    _this.eligibleSkills.push(SuperSkillShuffle.Skill.GetSkillByName("Grisly Wound"));
                    _this.eligibleSkills.push(SuperSkillShuffle.Skill.GetSkillByName("Relief"));
                    _this.eligibleSkills.push(SuperSkillShuffle.Skill.GetSkillByName("Speed +2"));
                    _this.eligibleSkills = _this.eligibleSkills.filter(_this.TestSkillEligible);
                    // Shuffle the list of eligible skills.
                    SkillShuffler.Shuffle(_this.eligibleSkills);
                    // Create a list of all the skill slots that weren't filled in by constant skills.
                    _this.skillSlots = [];
                    var classes = _this.ChosenShuffleOptions.UseDlc === DLCOption.All ?
                        SuperSkillShuffle.FEClass.GetAllClassesIncludingDlc() :
                        SuperSkillShuffle.FEClass.GetAllClasses();
                    classes.forEach(function (c) {
                        c.SkillSlots.forEach(function (ss) {
                            if (!ss.AssignedSkill) {
                                _this.skillSlots.push(ss);
                            }
                        });
                    });
                    SkillShuffler.Shuffle(_this.skillSlots);
                    _this.TooFewSkills = (_this.skillSlots.length > _this.eligibleSkills.length);
                    _this.chosenSkills = _this.eligibleSkills.slice(0, _this.skillSlots.length);
                    if (!_this.assignRestrictedSkills()) {
                        continue;
                    }
                    if (!_this.assignUnrestrictedSkills()) {
                        continue;
                    }
                    break;
                } while (attempts <= 100);
            };
            this.assignNecessarySkills = function () {
                _this.constantSkills = [];
                //All Nohr Princess, Hoshido Noble, Nohr Noble skills are constant
                //this.assignNamedSkill("Nohr Prince(ss)", "Nobility", 0);
                _this.assignNamedSkill("Nohr Prince(ss)", "Dragon Fang", 1);
                _this.assignNamedSkill("Hoshido Noble", "Dragon Ward", 0);
                _this.assignNamedSkill("Hoshido Noble", "Hoshidan Unity", 1);
                _this.assignNamedSkill("Nohr Noble", "Draconic Hex", 0);
                _this.assignNamedSkill("Nohr Noble", "Nohrian Trust", 1);
                // Make sure Outlaw and Ninja get Locktouch at Level 1
                _this.assignNamedSkill("Outlaw", "Locktouch", 0);
                _this.assignNamedSkill("Ninja", "Locktouch", 0);
                // Make sure Villager gets Aptitude at Level 1
                _this.assignNamedSkill("Villager", "Aptitude", 0);
            };
            this.assignNamedSkill = function (className, skillName, skillSlot) {
                var c = SuperSkillShuffle.FEClass.GetClassByName(className);
                var s = SuperSkillShuffle.Skill.GetSkillByName(skillName);
                c.SkillSlots[skillSlot].AssignedSkill = s;
                if (_this.constantSkills.indexOf(s) === -1) {
                    _this.constantSkills.push(s);
                }
            };
            // Goes through all the chosen skills and picks out the ones that have a restriction on which
            // class they can be assigned to.  Assigns those skills to valid classes.
            // Returns true if all restricted skills were successfully assigned or false if a problem occurred.
            this.assignRestrictedSkills = function () {
                // Assign the most restrictive skills first to ensure they don't run out of spaces.
                for (var compatibleWeaponTypesLength = 1; compatibleWeaponTypesLength < 10; compatibleWeaponTypesLength++) {
                    for (var i = 0; i < _this.chosenSkills.length; i++) {
                        var curr = _this.chosenSkills[i];
                        // If the skill doesn't require special treatment, skip it.
                        if (["Winged Shield", "Inspiring Song", "Beast Shield", "Armor Shield"].indexOf(curr.Name) === -1 && curr.WeaponTypes.length !== compatibleWeaponTypesLength) {
                            continue;
                        }
                        // Otherwise, look for a class that matches the requirements for this skill.
                        var test = function (c) {
                            // Winged Shield must be assigned to a flying class.
                            if (curr.Name === "Winged Shield" && ["Falcon Knight", "Kinshi Knight", "Sky Knight", "Wyvern Rider", "Wyvern Lord", "Malig Knight", "Dark Flier", "Pegasus Knight"].indexOf(c.Name) >= 0) {
                                return true;
                            }
                            // Armor Shield must be assigned to an armored class.
                            if (curr.Name === "Armor Shield" && ["Knight", "Great Knight", "General"].indexOf(c.Name) >= 0) {
                                return true;
                            }
                            // Beast Shield must be assigned to a beast class.
                            if (curr.Name === "Beast Shield" && ["Sky Knight", "Falcon Knight", "Kinshi Knight", "Kitsune", "Nine-Tails", "Cavalier", "Paladin", "Great Knight", "Bow Knight", "Dark Knight", "Wolfskin", "Wolfssegner", "Dark Falcon", "Pegasus Knight"].indexOf(c.Name) >= 0) {
                                return true;
                            }
                            // Inspiring Song is only useful if assigned to the Songstress class.
                            if (curr.Name === "Inspiring Song" && c.Name === "Songstress") {
                                return true;
                            }
                            // Shadowgift is redundant on Dark Mages & Sorcerers since they can use Nosferatu anyway.
                            if (curr.Name === "Shadowgift" && (c.Name === "Dark Mage" || c.Name === "Sorcerer")) {
                                return false;
                            }
                            // A class fits if at least one of its weapon types matches one of the skill's weapon types.
                            if (c.WeaponTypes.some(function (w) {
                                return curr.WeaponTypes.indexOf(w) >= 0;
                            })) {
                                return true;
                            }
                            return false;
                        };
                        var successfullyAssigned = false;
                        // Get the first skill slot in a class that matches the criteria, and assign the skill.
                        for (var j = 0; j < _this.skillSlots.length; j++) {
                            if (test(_this.skillSlots[j].Class) && _this.verifyNoDuplicateSkill(_this.skillSlots[j].Class, curr)) {
                                _this.skillSlots[j].AssignedSkill = curr;
                                _this.chosenSkills.splice(i, 1);
                                _this.skillSlots.splice(j, 1);
                                i--;
                                successfullyAssigned = true;
                                break;
                            }
                        }
                        // If we failed to assign a restricted skill that was selected, set a flag to retry the shuffle.
                        if (!successfullyAssigned) {
                            debugger;
                            return false;
                        }
                    }
                }
                return true;
            };
            // Go through the remaining skill slots and assign each one the first remaining available skill.
            // The only restriction is that duplicate skills can't be assigned to the same class or two classes
            // in a base-promoted relationship.
            // Returns true if all the remaining skills were assigned successfully or false if one couldn't be assigned.
            this.assignUnrestrictedSkills = function () {
                for (var i = 0; i < _this.skillSlots.length; i++) {
                    var successfullyAssigned = false;
                    for (var j = 0; j < _this.chosenSkills.length; j++) {
                        var c = _this.skillSlots[i].Class;
                        var s = _this.chosenSkills[j];
                        if (_this.verifyNoDuplicateSkill(c, s)) {
                            _this.skillSlots[i].AssignedSkill = s;
                            _this.chosenSkills.splice(j, 1);
                            successfullyAssigned = true;
                            break;
                        }
                    }
                    if (!successfullyAssigned) {
                        debugger;
                        return false;
                    }
                }
                return true;
            };
            // Check to verify that the given skill is not already assigned to the given class, since two copies of the
            // same skill are redundant.
            // Returns false if a duplicate is found, true otherwise.
            this.verifyNoDuplicateSkill = function (c, s) {
                // Helper function to find if one given skill is Resist Status and the other is Immune Status
                var resimm = function (s1, s2) {
                    return (s1 && s2 && ((s1.Name === "Immune Status" && s2.Name === "Resist Status")
                        || (s1.Name === "Resist Status" && s2.Name === "Immune Status")));
                };
                // Ensure there is no duplicate of the given skill in the given class.
                for (var i = 0; i < c.SkillSlots.length; i++) {
                    if (c.SkillSlots[i].AssignedSkill === s || resimm(c.SkillSlots[i].AssignedSkill, s)) {
                        return false;
                    }
                }
                // Ensure there is no duplicate of the given skill in a base class of the given class.
                for (i = 0; i < c.BaseClasses.length; i++) {
                    for (var j = 0; j < c.BaseClasses[i].SkillSlots.length; j++) {
                        if (c.BaseClasses[i].SkillSlots[j].AssignedSkill === s
                            || resimm(c.BaseClasses[i].SkillSlots[j].AssignedSkill, s)) {
                            return false;
                        }
                    }
                }
                // Ensure there is no duplicate of the given skill in a promoted class of the given class.
                for (i = 0; i < c.PromotedClasses.length; i++) {
                    for (j = 0; j < c.PromotedClasses[i].SkillSlots.length; j++) {
                        if (c.PromotedClasses[i].SkillSlots[j].AssignedSkill === s
                            || resimm(c.PromotedClasses[i].SkillSlots[j].AssignedSkill, s)) {
                            return false;
                        }
                    }
                }
                return true;
            };
            this.GetSkillAssignmentKey = function () {
                var result = "";
                var classes;
                if (_this.ChosenShuffleOptions.UseDlc === DLCOption.All) {
                    classes = SuperSkillShuffle.FEClass.GetAllClassesIncludingDlc();
                    result += "DLC:";
                }
                else {
                    classes = SuperSkillShuffle.FEClass.GetAllClasses();
                }
                classes.forEach(function (c) {
                    c.SkillSlots.forEach(function (ss) {
                        result += ss.AssignedSkill.Id + ";" + (ss.Visible ? "V" : "H") + ":";
                    });
                });
                result += _this.TooFewSkills ? "F" : "O";
                result = btoa(result);
                return result;
            };
            this.LoadSkillAssignmenKey = function (key) {
                _this.ClearSkills();
                key = key.replace(/\s/g, "");
                key = atob(key);
                var skills = SuperSkillShuffle.Skill.GetAllSkills();
                var keyParts = key.split(":");
                // Determine whether the saved shuffle used DLC classes or not based on the presence of a
                // "DLC" prefix
                var classes;
                if (keyParts[0] === "DLC") {
                    keyParts.shift();
                    classes = SuperSkillShuffle.FEClass.GetAllClassesIncludingDlc();
                    if (!_this.ChosenShuffleOptions) {
                        _this.ChosenShuffleOptions = new ShuffleOptions();
                    }
                    _this.ChosenShuffleOptions.UseDlc = DLCOption.All;
                }
                else {
                    classes = SuperSkillShuffle.FEClass.GetAllClasses();
                    if (!_this.ChosenShuffleOptions) {
                        _this.ChosenShuffleOptions = new ShuffleOptions();
                    }
                    _this.ChosenShuffleOptions.UseDlc = DLCOption.None;
                }
                _this.TooFewSkills = (keyParts.pop() === "F");
                classes.forEach(function (c) {
                    c.SkillSlots.forEach(function (ss) {
                        var keyPart = keyParts.shift();
                        // keyPart is "id;visibility"
                        var keyPartSplit = keyPart.split(";");
                        var id = parseInt(keyPartSplit[0], 10);
                        if (isNaN(id) || id > skills.length || id < 0) {
                            throw new Error("The key the user attempted to load contained an invalid ID.");
                        }
                        ss.AssignedSkill = skills[id];
                        var visibility = keyPartSplit[1];
                        ss.Visible = (visibility === "V");
                    });
                });
            };
            this.ChosenShuffleOptions = shuffleOptions;
        }
        SkillShuffler.prototype.ClearSkills = function () {
            var _this = this;
            SuperSkillShuffle.FEClass.GetAllClassesIncludingDlc().forEach(function (c) {
                c.SkillSlots.forEach(function (ss) {
                    ss.AssignedSkill = null;
                    ss.Visible = !!(_this.ChosenShuffleOptions && !_this.ChosenShuffleOptions.SurpriseMode);
                });
            });
        };
        SkillShuffler.Shuffle = function (array, newArray) {
            var arrayToShuffle;
            if (newArray) {
                arrayToShuffle = array.map(function (val) { return val; });
            }
            else {
                arrayToShuffle = array;
            }
            //Fisher-Yates shuffle
            //Chooses a random element of the array to go into the rightmost position and swaps it into place.
            //Then chooses a random element other than the rightmost to swap into the second-rightmost place.
            //This continues until all but one of the elements has been chosen (and that one becomes the leftmost).
            for (var i = arrayToShuffle.length; i > 1; i--) {
                var chosenIndex = Math.floor(Math.random() * i);
                var temp = arrayToShuffle[chosenIndex];
                arrayToShuffle[chosenIndex] = arrayToShuffle[i - 1];
                arrayToShuffle[i - 1] = temp;
            }
            return arrayToShuffle;
        };
        return SkillShuffler;
    }());
    SuperSkillShuffle.SkillShuffler = SkillShuffler;
    (function (DLCOption) {
        DLCOption[DLCOption["None"] = 0] = "None";
        DLCOption[DLCOption["Skills"] = 1] = "Skills";
        DLCOption[DLCOption["All"] = 2] = "All";
    })(SuperSkillShuffle.DLCOption || (SuperSkillShuffle.DLCOption = {}));
    var DLCOption = SuperSkillShuffle.DLCOption;
    var ShuffleOptions = (function () {
        function ShuffleOptions() {
        }
        return ShuffleOptions;
    }());
    SuperSkillShuffle.ShuffleOptions = ShuffleOptions;
})(SuperSkillShuffle || (SuperSkillShuffle = {}));
//# sourceMappingURL=SkillAssignment.js.map