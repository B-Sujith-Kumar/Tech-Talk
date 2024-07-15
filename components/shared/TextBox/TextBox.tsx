"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Toolbar } from "./Toolbar";
import { useEffect } from "react";
import Link from "@tiptap/extension-link";
import { Node } from "@tiptap/core";
import "./styles.css"
import { usePathname } from "next/navigation";

export default function TextBox({
    description,
    onValueChange,
    clearText,
    editable
}: {
    description?: string,
    onValueChange?: (richText: string) => void,
    clearText?: boolean,
    editable?: boolean
}) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                    HTMLAttributes: {
                        class: "font-bold my-5",
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: "list-decimal"
                    }
                },
                paragraph: {
                    HTMLAttributes: {
                        class: "mb-2 leading-relaxed text-base max-sm:leading-loose"
                    }
                },
                bulletList: {
                    HTMLAttributes: {
                        class: "list-disc"
                    }
                },
                listItem: {
                    HTMLAttributes: {
                        class: "ml-4 leading-relaxed"
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
            Link.configure({
                openOnClick: false,
                autolink: true,
                linkOnPaste: true,
                HTMLAttributes: {
                    class: "text-blue-500 underline"
                }
            }),
            Node.create({
                whitespace: "pre",
            })
        ],
        content: description,
        editorProps: {
            attributes: {
                class: "block w-full placeholder:text-gray-500 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 placeholder-transparent border-none focus:outline-none px-2"
            }
        },
        onUpdate({ editor }) {
            if (onValueChange) {
                onValueChange(editor.getHTML());
            }
        },
        parseOptions: {
            preserveWhitespace: "full",
        },
        editable: editable,
    });

    useEffect(() => {
        if (clearText) {
            editor?.commands.setContent("Write your post content here...");
        }
    }, [clearText]);

    const pathname = usePathname();

    return <>
        <div className="flex flex-col">
            <Toolbar editor={editor} render={editable as boolean} />
            <EditorContent editor={editor}
                className={`
                    ${(pathname.includes("/post/") && pathname !== "/post/create") ? "" : "max-h-96 overflow-y-auto"}
                    `}
                placeholder="Write your post content here..."
            />
        </div>
    </>
}