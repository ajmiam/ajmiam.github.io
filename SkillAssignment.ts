module SuperSkillShuffle
{
    export class SkillShuffler
    {
        private eligibleSkills: Skill[];
        private chosenSkills: Skill[];
        private skillSlots: SkillSlot[];
        private constantSkills: Skill[];
        
        public ChosenShuffleOptions: ShuffleOptions;
        public TooFewSkills: boolean;

        constructor(shuffleOptions: ShuffleOptions)
        {
            this.ChosenShuffleOptions = shuffleOptions;
        }

        // Determines if a skill is eligible to be included in the shuffle
        // according to the chosen options.  Returns true if so, false if not.
        public TestSkillEligible = (s: Skill): boolean =>
        {
            // If the skill is constant, it was already assigned, so don't assign it again.
            if (this.constantSkills.indexOf(s) >= 0)
            {
                return false;
            }

            // Exclude skills marked as "weak" if the option was chosen.
            if (this.ChosenShuffleOptions.ExcludeWeakSkills && s.IsWeak())
            {
                return false;
            }

            // Ballista-only skils are useless without the Ballista class existing!
            if ((this.ChosenShuffleOptions.UseDlc !== DLCOption.All) && (s.WeaponTypes.length === 1 && s.WeaponTypes[0] === WeaponType.Ballista))
            {
                return false;
            }

            // All other "standard" type skills are allowed.
            if (s.IsStandard())
            {
                return true;
            }

            // DLC skills may be allowed or not, depending on user settings
            if (s.IsDlc() && !(s.SkillType === SkillType.Taker) && this.ChosenShuffleOptions.UseDlc !== DLCOption.None)
            {
                if (s.SkillType === SkillType.DlcClassAndTaker)
                {
                    return (this.ChosenShuffleOptions.UseDlc === DLCOption.All) || this.ChosenShuffleOptions.IncludeTakers;
                }

                return true;
            }

            // "Stattaker" skills also get a separate setting
            if (s.SkillType === SkillType.Taker && this.ChosenShuffleOptions.IncludeTakers)
            {
                return true;
            }

            // Enemy skills depend on the user's settings.
            if (s.IsEnemy())
            {
                // Staff Savant gets its own option
                if (s.SkillPowerLevel === SkillPowerLevel.StaffSavant)
                {
                    return this.ChosenShuffleOptions.IncludeStaffSavant;
                }
                else
                {
                    return s.SkillPowerLevel <= this.ChosenShuffleOptions.MaximumSkillPowerLevel;
                }
            }

            return false;
        }

        public AssignSkills = (): void =>
        {
            var attempts: number = 0;
            do
            {
                attempts++;
                this.ClearSkills();

                // Assign the skills that are constant in every shuffle.
                this.assignNecessarySkills();
                
                // Determine which of the remaining skills are eligible based on the user's settings.
                this.eligibleSkills = Skill.GetAllSkills().map(s => s);

                // Push duplicates of the skills that appear in two classes.
                this.eligibleSkills.push(Skill.GetSkillByName("Aether"));
                this.eligibleSkills.push(Skill.GetSkillByName("Charm"));
                this.eligibleSkills.push(Skill.GetSkillByName("Beastbane"));
                this.eligibleSkills.push(Skill.GetSkillByName("Grisly Wound"));
                this.eligibleSkills.push(Skill.GetSkillByName("Relief"));
                this.eligibleSkills.push(Skill.GetSkillByName("Speed +2"));

                this.eligibleSkills = this.eligibleSkills.filter(this.TestSkillEligible);

                // Shuffle the list of eligible skills.
                SkillShuffler.Shuffle(this.eligibleSkills);

                // Create a list of all the skill slots that weren't filled in by constant skills.
                this.skillSlots = [];
                var classes: FEClass[] = this.ChosenShuffleOptions.UseDlc === DLCOption.All ?
                    FEClass.GetAllClassesIncludingDlc() :
                    FEClass.GetAllClasses();
                classes.forEach((c: FEClass): void =>
                {
                    c.SkillSlots.forEach((ss: SkillSlot): void =>
                    {
                        if (!ss.AssignedSkill)
                        {
                            this.skillSlots.push(ss);
                        }
                    });
                });

                SkillShuffler.Shuffle(this.skillSlots);

                this.TooFewSkills = (this.skillSlots.length > this.eligibleSkills.length);

                this.chosenSkills = this.eligibleSkills.slice(0, this.skillSlots.length);

                if (!this.assignRestrictedSkills())
                {
                    continue;
                }
                if (!this.assignUnrestrictedSkills())
                {
                    continue;
                }

                break;
            } while (attempts <= 100);
        }

        public ClearSkills()
        {
            FEClass.GetAllClassesIncludingDlc().forEach((c: FEClass): void =>
            {
                c.SkillSlots.forEach((ss: SkillSlot): void =>
                {
                    ss.AssignedSkill = null;
                    ss.Visible = !!(this.ChosenShuffleOptions && !this.ChosenShuffleOptions.SurpriseMode);
                });
            });
        }

        private assignNecessarySkills = (): void =>
        {
            this.constantSkills = [];
            //All Nohr Princess, Hoshido Noble, Nohr Noble skills are constant
            //this.assignNamedSkill("Nohr Prince(ss)", "Nobility", 0);
            this.assignNamedSkill("Nohr Prince(ss)", "Dragon Fang", 1);
            this.assignNamedSkill("Hoshido Noble", "Dragon Ward", 0);
            this.assignNamedSkill("Hoshido Noble", "Hoshidan Unity", 1);
            this.assignNamedSkill("Nohr Noble", "Draconic Hex", 0);
            this.assignNamedSkill("Nohr Noble", "Nohrian Trust", 1);

            // Make sure Outlaw and Ninja get Locktouch at Level 1
            this.assignNamedSkill("Outlaw", "Locktouch", 0);
            this.assignNamedSkill("Ninja", "Locktouch", 0);

            // Make sure Villager gets Aptitude at Level 1
            this.assignNamedSkill("Villager", "Aptitude", 0);
        }

        private assignNamedSkill = (className: string, skillName: string, skillSlot: number): void =>
        {
            var c: FEClass = FEClass.GetClassByName(className);
            var s: Skill = Skill.GetSkillByName(skillName);
            c.SkillSlots[skillSlot].AssignedSkill = s;
            if (this.constantSkills.indexOf(s) === -1)
            {
                this.constantSkills.push(s);
            }
        }

        // Goes through all the chosen skills and picks out the ones that have a restriction on which
        // class they can be assigned to.  Assigns those skills to valid classes.
        // Returns true if all restricted skills were successfully assigned or false if a problem occurred.
        private assignRestrictedSkills = (): boolean =>
        {
            // Assign the most restrictive skills first to ensure they don't run out of spaces.
            for (var compatibleWeaponTypesLength = 1; compatibleWeaponTypesLength < 10; compatibleWeaponTypesLength++)
            {
                for (var i = 0; i < this.chosenSkills.length; i++)
                {
                    var curr: Skill = this.chosenSkills[i];

                    // If the skill doesn't require special treatment, skip it.
                    if (["Winged Shield", "Inspiring Song", "Beast Shield", "Armor Shield"].indexOf(curr.Name) === -1 && curr.WeaponTypes.length !== compatibleWeaponTypesLength)
                    {
                        continue;
                    }

                    // Otherwise, look for a class that matches the requirements for this skill.
                    var test = (c: FEClass): boolean =>
                    {
                        // Winged Shield must be assigned to a flying class.
                        if (curr.Name === "Winged Shield" && ["Falcon Knight", "Kinshi Knight", "Sky Knight", "Wyvern Rider", "Wyvern Lord", "Malig Knight", "Dark Flier", "Pegasus Knight"].indexOf(c.Name) >= 0)
                        {
                            return true;
                        }

                        // Armor Shield must be assigned to an armored class.
                        if (curr.Name === "Armor Shield" && ["Knight", "Great Knight", "General"].indexOf(c.Name) >= 0)
                        {
                            return true;
                        }

                        // Beast Shield must be assigned to a beast class.
                        if (curr.Name === "Beast Shield" && ["Sky Knight", "Falcon Knight", "Kinshi Knight", "Kitsune", "Nine-Tails", "Cavalier", "Paladin", "Great Knight", "Bow Knight", "Dark Knight", "Wolfskin", "Wolfssegner", "Dark Falcon", "Pegasus Knight"].indexOf(c.Name) >= 0)
                        {
                            return true;
                        }

                        // Inspiring Song is only useful if assigned to the Songstress class.
                        if (curr.Name === "Inspiring Song" && c.Name === "Songstress")
                        {
                            return true;
                        }

                        // Shadowgift is redundant on Dark Mages & Sorcerers since they can use Nosferatu anyway.
                        if (curr.Name === "Shadowgift" && (c.Name === "Dark Mage" || c.Name === "Sorcerer"))
                        {
                            return false;
                        }

                        // A class fits if at least one of its weapon types matches one of the skill's weapon types.
                        if (c.WeaponTypes.some((w: WeaponType): boolean =>
                        {
                            return curr.WeaponTypes.indexOf(w) >= 0;
                        }))
                        {
                            return true;
                        }

                        return false;
                    }

                    var successfullyAssigned: boolean = false;

                    // Get the first skill slot in a class that matches the criteria, and assign the skill.
                    for (var j: number = 0; j < this.skillSlots.length; j++)
                    {
                        if (test(this.skillSlots[j].Class) && this.verifyNoDuplicateSkill(this.skillSlots[j].Class, curr))
                        {
                            this.skillSlots[j].AssignedSkill = curr;
                            this.chosenSkills.splice(i, 1);
                            this.skillSlots.splice(j, 1);
                            i--;
                            successfullyAssigned = true;
                            break;
                        }
                    }

                    // If we failed to assign a restricted skill that was selected, set a flag to retry the shuffle.
                    if (!successfullyAssigned)
                    {
                        debugger;
                        return false;
                    }
                }
            }

            return true;
        }

        // Go through the remaining skill slots and assign each one the first remaining available skill.
        // The only restriction is that duplicate skills can't be assigned to the same class or two classes
        // in a base-promoted relationship.
        // Returns true if all the remaining skills were assigned successfully or false if one couldn't be assigned.
        private assignUnrestrictedSkills = (): boolean =>
        {
            for (var i = 0; i < this.skillSlots.length; i++)
            {
                var successfullyAssigned: boolean = false;

                for (var j = 0; j < this.chosenSkills.length; j++)
                {
                    var c: FEClass = this.skillSlots[i].Class;
                    var s: Skill = this.chosenSkills[j];
                    if (this.verifyNoDuplicateSkill(c, s))
                    {
                        this.skillSlots[i].AssignedSkill = s;
                        this.chosenSkills.splice(j, 1);
                        successfullyAssigned = true;
                        break;
                    }
                }

                if (!successfullyAssigned)
                {
                    debugger;
                    return false;
                }
            }

            return true;
        }

        // Check to verify that the given skill is not already assigned to the given class, since two copies of the
        // same skill are redundant.
        // Returns false if a duplicate is found, true otherwise.
        private verifyNoDuplicateSkill = (c: FEClass, s: Skill): boolean =>
        {
            // Helper function to find if one given skill is Resist Status and the other is Immune Status
            var resimm = function (s1: Skill, s2: Skill): boolean
            {
                return (s1 && s2 && ((s1.Name === "Immune Status" && s2.Name === "Resist Status")
                    || (s1.Name === "Resist Status" && s2.Name === "Immune Status")));
            }
            // Ensure there is no duplicate of the given skill in the given class.
            for (var i = 0; i < c.SkillSlots.length; i++)
            {
                if (c.SkillSlots[i].AssignedSkill === s || resimm(c.SkillSlots[i].AssignedSkill, s))
                {
                    return false;
                }
            }

            // Ensure there is no duplicate of the given skill in a base class of the given class.
            for (i = 0; i < c.BaseClasses.length; i++)
            {
                for (var j = 0; j < c.BaseClasses[i].SkillSlots.length; j++)
                {
                    if (c.BaseClasses[i].SkillSlots[j].AssignedSkill === s
                    || resimm(c.BaseClasses[i].SkillSlots[j].AssignedSkill, s))
                    {
                        return false;
                    }
                }
            }

            // Ensure there is no duplicate of the given skill in a promoted class of the given class.
            for (i = 0; i < c.PromotedClasses.length; i++)
            {
                for (j = 0; j < c.PromotedClasses[i].SkillSlots.length; j++)
                {
                    if (c.PromotedClasses[i].SkillSlots[j].AssignedSkill === s
                    || resimm(c.PromotedClasses[i].SkillSlots[j].AssignedSkill, s))
                    {
                        return false;
                    }
                }
            }

            return true;
        }
        
        public static Shuffle<T>(array: T[], newArray?: boolean): T[] 
        {
            var arrayToShuffle: T[];
            if (newArray)
            {
                arrayToShuffle = array.map(val => val);
            }
            else
            {
                arrayToShuffle = array;
            }

            //Fisher-Yates shuffle
            //Chooses a random element of the array to go into the rightmost position and swaps it into place.
            //Then chooses a random element other than the rightmost to swap into the second-rightmost place.
            //This continues until all but one of the elements has been chosen (and that one becomes the leftmost).
            for (var i = arrayToShuffle.length; i > 1; i--)
            {
                
                var chosenIndex: number = Math.floor(Math.random() * i);
                var temp: T = arrayToShuffle[chosenIndex];
                arrayToShuffle[chosenIndex] = arrayToShuffle[i-1];
                arrayToShuffle[i-1] = temp;
            }

            return arrayToShuffle;
        }

        public GetSkillAssignmentKey = (): string =>
        {
            var result: string = "";

            var classes: FEClass[];
            if (this.ChosenShuffleOptions.UseDlc === DLCOption.All)
            {
                classes = FEClass.GetAllClassesIncludingDlc();
                result += "DLC:";
            }
            else
            {
                classes = FEClass.GetAllClasses();
            }

            classes.forEach((c: FEClass): void =>
            {
                c.SkillSlots.forEach((ss: SkillSlot): void =>
                {
                    result += ss.AssignedSkill.Id + ";" + (ss.Visible ? "V" : "H") + ":";
                });
            });

            result += this.TooFewSkills ? "F" : "O";
            result = btoa(result);
            return result;
        }

        public LoadSkillAssignmenKey = (key: string): void =>
        {
            this.ClearSkills();

            key = key.replace(/\s/g, "");
            
            key = atob(key);
            var skills: Skill[] = Skill.GetAllSkills();
            var keyParts: string[] = key.split(":");

            // Determine whether the saved shuffle used DLC classes or not based on the presence of a
            // "DLC" prefix
            var classes: FEClass[];
            if (keyParts[0] === "DLC")
            {
                keyParts.shift();
                classes = FEClass.GetAllClassesIncludingDlc();
                if (!this.ChosenShuffleOptions)
                {
                    this.ChosenShuffleOptions = new ShuffleOptions();
                }
                this.ChosenShuffleOptions.UseDlc = DLCOption.All;
            }
            else
            {
                classes = FEClass.GetAllClasses();
                if (!this.ChosenShuffleOptions)
                {
                    this.ChosenShuffleOptions = new ShuffleOptions();
                }
                this.ChosenShuffleOptions.UseDlc = DLCOption.None;
            }
            
            this.TooFewSkills = (keyParts.pop() === "F");
            classes.forEach((c: FEClass): void =>
            {
                c.SkillSlots.forEach((ss: SkillSlot): void =>
                {
                    var keyPart: string = keyParts.shift();
                    // keyPart is "id;visibility"
                    var keyPartSplit: string[] = keyPart.split(";");

                    var id: number = parseInt(keyPartSplit[0], 10);
                    if (isNaN(id) || id > skills.length || id < 0)
                    {
                        throw new Error("The key the user attempted to load contained an invalid ID.");
                    }
                    ss.AssignedSkill = skills[id];
                        
                    var visibility: string = keyPartSplit[1];
                    ss.Visible = (visibility === "V");
                });
            });
        }
    }

    export enum DLCOption
    {
        None = 0,
        Skills = 1,
        All = 2
    }

    export class ShuffleOptions
    {
        public UseEnemySkills: boolean;
        public MaximumSkillPowerLevel: SkillPowerLevel;
        public IncludeStaffSavant: boolean;
        public ExcludeWeakSkills: boolean;
        public SurpriseMode: boolean;
        public UseDlc: DLCOption;
        public IncludeTakers: boolean;
    }
}
