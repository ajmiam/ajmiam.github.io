module SuperSkillShuffle
{
    export class WeaponType
    {
        public Name: string;
        public IconPath: string;

        private static ipp = "Content/Images/";

        public static Sword: WeaponType = { Name: "Sword", IconPath: "sword.png" };
        public static Lance: WeaponType = { Name: "Lance", IconPath: "lance.png" };
        public static Axe: WeaponType = { Name: "Axe", IconPath: "axe.png" };
        public static Bow: WeaponType = { Name: "Bow", IconPath: "bow.png" };
        public static Beaststone: WeaponType = { Name: "Beaststone", IconPath: "beaststone.png" };
        public static Dragonstone: WeaponType = { Name: "Dragonstone", IconPath: "dragonstone.png" };
        public static Shuriken: WeaponType = { Name: "Shuriken", IconPath: "shuriken.png" };
        public static Tome: WeaponType = { Name: "Tome", IconPath: "tome.png" };
        public static Staff: WeaponType = { Name: "Staff", IconPath: "staff.png" };

        public static Ballista: WeaponType = { Name: "Ballista", IconPath: "bow.png" };
    }
}