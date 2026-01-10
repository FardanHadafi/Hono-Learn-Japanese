import { KanaItem } from "@/model/Enums";

export interface KanaProvider {
  getItems(
    scriptType: "hiragana" | "katakana",
    jlptLevel: "N5" | "N4",
    group: string
  ): KanaItem[];
}
