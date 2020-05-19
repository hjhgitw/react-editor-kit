import { Plugin } from "../../plugins/Plugin";
import { ClearFormattingPluginAction } from "./ClearFormattingPluginAction";

export const DefaultClearableEditorFormats = [
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "fontSize",
  "color",
  "backgroundColor",
];

export const createClearFormattingPlugin = (
  formats = DefaultClearableEditorFormats
): Plugin => {
  return {
    name: "clear-formatting",
    formats,
    actions: [ClearFormattingPluginAction],
  };
};
