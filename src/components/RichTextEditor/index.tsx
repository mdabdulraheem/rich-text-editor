import React, { KeyboardEvent, useEffect } from 'react';
import { Editor, EditorState, RichUtils, Modifier, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import './index.scss';
import { COMMAND_TYPES } from './utils/types';
import Button from '../common/Button';
import Title from '../common/Title';
import {
    addNewBlock,
    customBlockStyleFn,
    getBlockType,
    CUSTOM_STYLE_MAP,
    STORAGE_KEY,
} from './utils/common';
import { KEYBOARD_SHORTCUTS } from './utils/commands';

type Props = {
    showSaveButton: boolean;
    onSave: (state: EditorState) => void;
    name: string;
};

const RichTextEditor = (props: Props) => {
    const { showSaveButton, onSave, name } = props;

    // Initialize empty editor state
    const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());

    // Load editor contents from local storage
    useEffect(() => {
        const savedContent = localStorage.getItem(STORAGE_KEY);
        if (savedContent) {
            const contentRaw = JSON.parse(savedContent);
            const contentState = convertFromRaw(contentRaw);
            setEditorState(EditorState.createWithContent(contentState));
        }
    }, []);

    const handleBeforeInput = (input: string, state: EditorState) => {
        if (input === ' ') {
            const selectionState = state.getSelection();
            const contentState = state.getCurrentContent();
            const currentBlock = contentState.getBlockForKey(selectionState.getStartKey());

            // Check if currentBlock is defined before using it
            if (!currentBlock) {
                return 'handled';
            }

            const currentBlockText = currentBlock.getText();
            const end = selectionState.getEndOffset();

            // Check if the block text matches any commands
            const custom_command = Object.prototype.hasOwnProperty.call(
                KEYBOARD_SHORTCUTS,
                currentBlockText.trim(),
            )
                ? KEYBOARD_SHORTCUTS[currentBlockText.trim()]
                : false;

            if (custom_command) {
                const newContentState = Modifier.replaceText(
                    contentState,
                    selectionState.merge({
                        anchorOffset: 0,
                        focusOffset: end,
                    }),
                    '',
                );

                const newEditorState = EditorState.push(
                    editorState,
                    newContentState,
                    'remove-range',
                );
                setEditorState(newEditorState);
                if (custom_command.type === COMMAND_TYPES.BLOCK) {
                    setEditorState(
                        RichUtils.toggleBlockType(newEditorState, custom_command.command),
                    );
                } else if (custom_command.type === COMMAND_TYPES.INLINE) {
                    setEditorState(
                        RichUtils.toggleInlineStyle(newEditorState, custom_command.command),
                    );
                }
                return 'handled';
            }
        }

        return 'not-handled';
    };

    const handleKeyCommand = (command: string, state: EditorState) => {
        const newState = RichUtils.handleKeyCommand(state, command);
        if (newState) {
            setEditorState(newState);
            return 'handled';
        }
        return 'not-handled';
    };

    const onChange = (state: EditorState) => {
        setEditorState(state);
    };

    const handleReturn = (event: KeyboardEvent, state: EditorState) => {
        const blockType = getBlockType(state);
        if (blockType === 'code-block') {
            return 'not-handled';
        }
        if (event.shiftKey) {
            setEditorState(RichUtils.insertSoftNewline(state));
            return 'handled';
        } else {
            const newEditorState = addNewBlock(state);
            setEditorState(newEditorState);
            return 'handled';
        }
    };

    return (
        <>
            <div className="mb-4 sm:flex">
                <div className="mb-2 flex-1">
                    {name && (
                        <Title>
                            Demo <span className="text-purple-600">Editor</span> by {name}
                        </Title>
                    )}
                </div>
                {showSaveButton && (
                    <div className="text-right">
                        <Button onClick={() => onSave(editorState)}>Save Note</Button>
                    </div>
                )}
            </div>
            <div className="editor">
                <Editor
                    editorState={editorState}
                    onChange={onChange}
                    handleKeyCommand={handleKeyCommand}
                    handleBeforeInput={handleBeforeInput}
                    customStyleMap={CUSTOM_STYLE_MAP}
                    placeholder="Write someting amazing..."
                    handleReturn={handleReturn}
                    blockStyleFn={customBlockStyleFn}
                />
            </div>
        </>
    );
};

export default RichTextEditor;
