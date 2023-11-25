import { ContentBlock, ContentState, EditorState, genKey } from 'draft-js';

export const getBlockType = (state: EditorState) => {
    const selection = state.getSelection();
    const contentState = state.getCurrentContent();
    const currentBlock = contentState.getBlockForKey(selection.getEndKey());
    return currentBlock.getType();
};

export const addNewBlock = (editorState: EditorState) => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const currentBlock = contentState.getBlockForKey(selection.getEndKey());

    const blockMap = contentState.getBlockMap();

    // Split the blocks
    const blocksBefore = blockMap.toSeq().takeUntil((v) => v === currentBlock);
    const blocksAfter = blockMap
        .toSeq()
        .skipUntil((v) => v === currentBlock)
        .rest();

    const newBlockKey = genKey();
    const newBlocks = [
        [
            currentBlock.getKey(),
            currentBlock.merge({
                text: currentBlock.getText().slice(0, selection.getStartOffset()),
            }),
        ],
        [
            newBlockKey,
            new ContentBlock({
                key: newBlockKey,
                type: 'unstyled',
                text: '\n',
                characterList: '',
            }),
        ],
    ];

    const newBlockMap = blocksBefore.concat(newBlocks, blocksAfter).toOrderedMap();
    const newContentState = contentState.merge({
        blockMap: newBlockMap,
        selectionBefore: selection,
        selectionAfter: selection.merge({
            anchorKey: newBlockKey,
            anchorOffset: 0,
            focusKey: newBlockKey,
            focusOffset: 0,
        }),
    }) as ContentState;

    const newEditorState = EditorState.push(editorState, newContentState, 'insert-fragment');

    return newEditorState;
};

export const customBlockStyleFn = (contentBlock: ContentBlock) => {
    const type = contentBlock.getType();
    if (type === 'header-one') {
        return 'text-4xl font-bold';
    } else if (type === 'code-block') {
        return 'block whitespace-nowrap';
    }
    return '';
};

export const CUSTOM_STYLE_MAP = {
    COLOR_RED: {
        color: 'red',
    },
};

export const STORAGE_KEY = 'editor_contents';
