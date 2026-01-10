import { KanaProvider } from "./kanaProvider";
import { KanaItem } from "@/model/Enums";
import { hiragana, katakana } from "@/data/kana";

export class KanaStaticProvider implements KanaProvider {
  getItems(
    scriptType: "hiragana" | "katakana",
    jlptLevel: "N5" | "N4",
    group: string
  ): KanaItem[] {
    const source = scriptType === "hiragana" ? hiragana : katakana;

    return source
      .filter((item) => item.type === scriptType)
      .map((item) => ({
        kana: item.char,
        romaji: item.romaji,
        jlptLevel,
        group,
      }));
  }
}
