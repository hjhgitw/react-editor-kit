import { MatchResult } from "../../editor/Matching";
import { applyRegexMark } from "../marks/Marks";
import { Trigger } from "../../plugins/Trigger";
import { EditorState } from "../../editor/EditorState";

export const BoldMarkdownTrigger: Trigger = {
  pattern: /(\*\*)(.{1,})\1/,
  onMatch: (state: EditorState, matches: MatchResult[]) => {
    applyRegexMark(state.editor, matches[0], "bold");
  },
  clear: false,
};
