"use client";

import { type Editor } from "@tiptap/react";
import { BoldIcon, StrikethroughIcon, ItalicIcon, ListIcon, ListOrderedIcon, Heading1Icon, Heading2Icon, Heading3Icon, CodeIcon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
type Props = {
    editor: Editor | null;
}

export function Toolbar({ editor }: Props) {
    if (!editor) return null;
    return <>
        <div className="flex gap-1 my-2">
            <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 1 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
                <Heading1Icon size={20} className="w-4 h-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 2 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
                <Heading2Icon size={20} className="w-4 h-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 3 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
                <Heading3Icon size={20} className="w-4 h-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
            >
                <BoldIcon size={20} className="w-4 h-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("italic")}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            >
                <ItalicIcon size={20} className="w-4 h-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("strike")}
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            >
                <StrikethroughIcon size={20} className="w-4 h-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
            >
                <ListIcon size={20} className="w-4 h-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("orderedList")}
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
            >
                <ListOrderedIcon size={20} className="w-4 h-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("code")}
                onPressedChange={() => editor.chain().focus().toggleCode().run()}
            >
                <CodeIcon size={20} className="w-4 h-4" />
            </Toggle>
        </div>
    </>
}