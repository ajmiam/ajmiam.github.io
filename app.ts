module SuperSkillShuffle
{
    var skillOutputId: number = 0;
    var classOutputId: number = 0;
    var shuffler: SkillShuffler;
    
    $("document").ready((): void =>
    {
        shuffler = new SkillShuffler(getShuffleOptions());

        $("#btnShuffle").click(shuffle);
        $("#btnLoadKey").click(load);
    });

    function getShuffleOptions(): ShuffleOptions
    {
        var result: ShuffleOptions = new ShuffleOptions();
        var skillLevel: number = parseInt($("#selEnemySkillLevel").val());
        var useDlc: number = parseInt($("#selDlc").val());
        result.MaximumSkillPowerLevel = isNaN(skillLevel) ? -1 : skillLevel;
        result.IncludeStaffSavant = $("#chkStaffSavant").prop("checked");
        result.SurpriseMode = $("#chkSurprise").prop("checked");
        result.UseEnemySkills = (!isNaN(skillLevel) && skillLevel >= 0);
        result.UseDlc = isNaN(useDlc) ? 0 : useDlc;
        result.IncludeTakers = $("#chkTakers").prop("checked");
        result.ExcludeWeakSkills = ((result.UseEnemySkills) || (result.UseDlc !== DLCOption.None) || result.IncludeTakers) && $("#chkWeakSkills").prop("checked");
        return result;
    }

    function shuffle(): void
    {
        shuffler.ChosenShuffleOptions = getShuffleOptions();
        shuffler.AssignSkills();
        outputResults();
        $("#txaKey").val(shuffler.GetSkillAssignmentKey());
    }

    function load(): void
    {
        try
        {
            shuffler.LoadSkillAssignmenKey($("#txaKey").val());

            outputResults();
            $("#keyError").text("Key loaded successfully");
        }
        catch (e)
        {
            $("#keyError").text("Error loading skill tree from key.  Check if key was copied correctly.");
        }
    }

    function outputResults(): void 
    {
        skillOutputId = 0;
        classOutputId = 0;
        $("#skillTree").empty();

        var table = document.createElement("table");
        table.id = "skillTreeTable";
        $("#skillTree").append(table);

        var baseClasses = (shuffler.ChosenShuffleOptions.UseDlc === DLCOption.All)
            ? FEClass.GetBaseClassesIncludingDlc()
            : FEClass.GetBaseClasses();

        baseClasses.forEach((bc: FEClass): void =>
        {
            var firstRow = document.createElement("tr");
            var baseClassContainer = document.createElement("td");
            baseClassContainer.id = "baseClass" + bc.Id;
            baseClassContainer.classList.add("classContainer", "baseClassContainer");

            if (bc.PromotedClasses.length > 1)
            {
                baseClassContainer.rowSpan = bc.PromotedClasses.length;
            }

            if (bc.PromotedClasses.length === 0)
            {
                baseClassContainer.colSpan = 2;
            }

            printClass(bc, baseClassContainer);

            $(firstRow).append(baseClassContainer);

            if (bc.PromotedClasses.length > 0)
            {
                var fpc = bc.PromotedClasses[0];
                var firstPromotedClassContainer = document.createElement("td");
                firstPromotedClassContainer.classList.add("classContainer", "promotedClassContainer", "promotedClassContainer0");
                firstPromotedClassContainer.id = "promotedClass" + bc.Id + "-" + fpc.Id;
                printClass(fpc, firstPromotedClassContainer);

                $(firstRow).append(firstPromotedClassContainer);
            }

            $(table).append(firstRow);

            for (var i: number = 1; i < bc.PromotedClasses.length; i++)
            {
                var npc = bc.PromotedClasses[i];
                var nextRow = document.createElement("tr");
                var nextPromotedClassContainer = document.createElement("td");
                nextPromotedClassContainer.classList.add("classContainer", "promotedClassContainer", "promotedClassContainer" + i);
                nextPromotedClassContainer.id = "promotedClass" + bc.Id + "-" + npc.Id;
                printClass(npc, nextPromotedClassContainer);

                $(nextRow).append(nextPromotedClassContainer);
                $(table).append(nextRow);
            }
        });

        $("input.chkShowHide").click((e: JQueryEventObject): void =>
        {
            var clickedChk = <HTMLInputElement>e.currentTarget;
            var classId: number = parseInt($(clickedChk).data("FEClass"));
            var slotIndex: number = parseInt($(clickedChk).data("index"));
            var c: FEClass = FEClass.GetAllClassesIncludingDlc()[classId];
            var slot: SkillSlot = c.SkillSlots[slotIndex];

            if (slot.Visible)
            {
                slot.Visible = false;
                $(".show-skill." + classId + "-" + slotIndex).hide();
                $(".hide-skill." + classId + "-" + slotIndex).show();
                $("input.chkShowHide." + classId + "-" + slotIndex).prop("checked", false);
            }
            else
            {
                slot.Visible = true;
                $(".show-skill." + classId + "-" + slotIndex).show();
                $(".hide-skill." + classId + "-" + slotIndex).hide();
                $("input.chkShowHide." + classId + "-" + slotIndex).prop("checked", true);
            }

            $("#txaKey").val(shuffler.GetSkillAssignmentKey());
        });
    }

    function printSkill(ss: SkillSlot, container: HTMLElement): void
    {
        container.classList.add("skill-container", ss.Class.Id + "-" + ss.Index);
        if (ss.AssignedSkill)
        {
            container.classList.add("skill-type" + ss.AssignedSkill.SkillType);
        }
        container.id = "skill-container" + skillOutputId;

        var chkShowHide = document.createElement("input");
        chkShowHide.type = "checkbox";
        chkShowHide.classList.add("chkShowHide", ss.Class.Id + "-" + ss.Index);
        chkShowHide.id = "chkShowHide" + skillOutputId;
        $(chkShowHide).data("FEClass", ss.Class.Id);
        $(chkShowHide).data("index", ss.Index);

        var levelDisplay = document.createElement("span");
        levelDisplay.classList.add("skill-level", ss.Class.Id + "-" + ss.Index);
        levelDisplay.id = "levelDisplay" + skillOutputId;
        levelDisplay.textContent = "Lv " + ss.GetSkillLevel() + ":";

        var showSkillSpan = document.createElement("span");
        showSkillSpan.id = "showSkill" + skillOutputId;
        showSkillSpan.classList.add("show-skill", ss.Class.Id + "-" + ss.Index);
        
        var skillNameSpan = document.createElement("span");
        skillNameSpan.id = "skillName" + skillOutputId;
        skillNameSpan.classList.add("skillName", ss.Class.Id + "-" + ss.Index);

        if (ss.AssignedSkill)
        {
            skillNameSpan.textContent = ss.AssignedSkill.Name;

            var skillImage = document.createElement("img");
            skillImage.id = "skillImage" + skillOutputId;
            skillImage.classList.add("skillImage", ss.Class.Id + "-" + ss.Index);
            skillImage.src = "Content/Images/Skills/" + ss.AssignedSkill.IconPath;

            $(showSkillSpan).append(skillImage, skillNameSpan);
        }
        else
        {
            skillNameSpan.classList.add("skillNameMissing");
            skillNameSpan.textContent = "NONE (Use default skill)";
            $(showSkillSpan).append(skillNameSpan);
        }

        var hideSkillSpan = document.createElement("span");
        hideSkillSpan.id = "hideSkill" + skillOutputId;
        hideSkillSpan.classList.add("hide-skill", ss.Class.Id + "-" + ss.Index);
        hideSkillSpan.textContent = "HIDDEN (check box to show)";

        $(container).append(chkShowHide, levelDisplay, showSkillSpan, hideSkillSpan);
        chkShowHide.checked = ss.Visible;
        if (ss.Visible)
        {
            $(hideSkillSpan).css("display", "none");
        }
        else
        {
            $(showSkillSpan).css("display", "none");
        }
        
        skillOutputId++;
    }

    function printClass(c: FEClass, container: HTMLElement)
    {
        var classHeader: HTMLSpanElement = document.createElement("span");
        classHeader.id = "classHeader" + classOutputId;
        classHeader.classList.add("classHeader");

        var className = document.createElement("span");
        className.id = "className" + classOutputId;
        className.classList.add("className");
        className.textContent = c.Name;

        $(classHeader).append(className);

        c.WeaponTypes.forEach((w: WeaponType, i: number): void =>
        {
            var weaponImage = document.createElement("img");
            weaponImage.id = "weaponImage" + classOutputId + "-" + i;
            weaponImage.classList.add("weaponTypeImage");
            weaponImage.src = "Content/Images/WeaponTypes/" + w.IconPath;
            $(classHeader).append(weaponImage);
        });

        $(container).append(classHeader);
        $(container).append(document.createElement("br"));

        c.SkillSlots.forEach((ss: SkillSlot): void =>
        {
            var skillSpan = document.createElement("span");
            printSkill(ss, skillSpan);
            $(container).append(skillSpan);
            $(container).append(document.createElement("br"));
        });

        classOutputId++;
    }
}