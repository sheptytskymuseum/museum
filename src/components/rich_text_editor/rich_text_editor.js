"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import useEventStore from "@/store/event_store";
import styles from "./rich_text_editor.module.css";

export default function RichTextEditor({ initialContent = "", disabled = false }) {
    const setDescription = useEventStore((state) => state.setDescription);

    const editor = useEditor({
        extensions: [StarterKit],
        content: initialContent,
        immediatelyRender: false,
        editable: !disabled,
        onUpdate: ({ editor }) => {
            setDescription(editor.getHTML());
        },
    });

    useEffect(() => {
        if (initialContent) {
            setDescription(initialContent);
        }
    }, []);

    useEffect(() => {
        if (editor) {
            editor.setEditable(!disabled);
        }
    }, [editor, disabled]);

    if (!editor) return null;

    const ToolbarButton = ({ onClick, isActive, title, children }) => (
        <button
            type="button"
            onClick={onClick}
            className={`${styles.toolbar_btn} ${isActive ? styles.active : ""}`}
            title={title}
            disabled={disabled}
        >
            {children}
        </button>
    );

    return (
        <div className={`${styles.editor_wrapper} ${disabled ? styles.disabled : ""}`}>
            <div className={styles.toolbar}>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    isActive={editor.isActive("paragraph") && !editor.isActive("bulletList")}
                    title="Paragraph"
                >
                    P
                </ToolbarButton>
                <div className={styles.divider} />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    title="Bold"
                >
                    <strong>B</strong>
                </ToolbarButton>
                <div className={styles.divider} />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive("bulletList")}
                    title="Bullet list"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <circle cx="2" cy="4" r="1.5" />
                        <rect x="5" y="3" width="9" height="2" rx="1" />
                        <circle cx="2" cy="8" r="1.5" />
                        <rect x="5" y="7" width="9" height="2" rx="1" />
                        <circle cx="2" cy="12" r="1.5" />
                        <rect x="5" y="11" width="9" height="2" rx="1" />
                    </svg>
                </ToolbarButton>
            </div>
            <EditorContent editor={editor} className={styles.editor_content} />
        </div>
    );
}
