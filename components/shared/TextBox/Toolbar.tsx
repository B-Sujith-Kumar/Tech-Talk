"use client";

import { type Editor } from "@tiptap/react";
import { BoldIcon, StrikethroughIcon, ItalicIcon, ListIcon, ListOrderedIcon, Heading1Icon, Heading2Icon, Heading3Icon, CodeIcon, LinkIcon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useCallback } from "react";
type Props = {
    editor: Editor | null;
    render: boolean;
}

export function Toolbar({ editor, render }: Props) {
    if (!editor || render === false) return null;
    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        // cancelled
        if (url === null) {
            return
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink()
                .run()

            return
        }

        // update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: url })
            .run()
    }, [editor])
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
                pressed={editor.isActive("link")}
                onPressedChange={() => setLink()}
            >
                <LinkIcon size={20} className="w-4 h-4" />
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