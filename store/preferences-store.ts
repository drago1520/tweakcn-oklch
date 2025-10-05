import { create } from "zustand";
import { persist } from "zustand/middleware";

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";
export type ColorSelectorTab = "list" | "palette";

interface PreferencesStore {
  tailwindVersion: "3" | "4";
  packageManager: PackageManager;
  colorSelectorTab: ColorSelectorTab;
  chatSuggestionsOpen: boolean;
  setTailwindVersion: (version: "3" | "4") => void;
  setPackageManager: (pm: PackageManager) => void;
  setColorSelectorTab: (tab: ColorSelectorTab) => void;
  setChatSuggestionsOpen: (open: boolean) => void;
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      tailwindVersion: "4",
      packageManager: "pnpm",
      colorSelectorTab: "list",
      chatSuggestionsOpen: true,
      setTailwindVersion: (version: "3" | "4") => {
        set({ tailwindVersion: version });
      },
      setPackageManager: (pm: PackageManager) => {
        set({ packageManager: pm });
      },
      setColorSelectorTab: (tab: ColorSelectorTab) => {
        set({ colorSelectorTab: tab });
      },
      setChatSuggestionsOpen: (open: boolean) => {
        set({ chatSuggestionsOpen: open });
      },
    }),
    {
      name: "preferences-storage",
    }
  )
);
