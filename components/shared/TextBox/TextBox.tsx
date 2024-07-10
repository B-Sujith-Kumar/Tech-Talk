"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Toolbar } from "./Toolbar";
import { useEffect, useState } from "react";

export default function TextBox({
    description,
    onValueChange,
    clearText,
}: {
    description?: string,
    onValueChange: (richText: string) => void,
    clearText?: boolean
}) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                orderedList: {
                    HTMLAttributes: {
                        class: "list-decimal"
                    }
                },
                bulletList: {
                    HTMLAttributes: {
                        class: "list-disc"
                    }
                },
                listItem: {
                    HTMLAttributes: {
                        class: "ml-4"
                    }
                },
                code: {
                    HTMLAttributes: {
                        class: "bg-gray-300 p-2 rounded-md text-black"
                    }
                },
                codeBlock: {
                    HTMLAttributes: {
                        class: "bg-gray-300 p-2 rounded-md text-black"
                    },
                    languageClassPrefix: "language-",
                    exitOnArrowDown: true,
                    exitOnTripleEnter: true,
                }
            }),
        ],
        content: description,
        editorProps: {
            attributes: {
                class: "block w-full placeholder:text-gray-500 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 placeholder-transparent border-none focus:outline-none px-2"
            }
        },
        onUpdate({ editor }) {
            onValueChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (clearText) {
            editor?.commands.setContent("Write your post content here...");
        }
    }, [clearText]);

    return <>
        <div className="flex flex-col justify-stretch min-h-[250px]">
            <Toolbar editor={editor} />
            <EditorContent editor={editor}
                placeholder="Write your post content here..."
            />
        </div>
    </>
}