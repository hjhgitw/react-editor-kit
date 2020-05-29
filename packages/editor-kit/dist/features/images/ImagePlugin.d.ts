import { Plugin } from "../../plugins/Plugin";
import { ReactEditor } from "slate-react";
import { Location } from "slate";
export declare const ImagePlugin: Plugin;
export declare const isImageUrl: (url: string, extensions?: string[]) => boolean;
export declare const insertImage: (editor: ReactEditor, url: string, location?: Location | undefined) => void;
