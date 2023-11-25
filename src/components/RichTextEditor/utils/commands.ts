import { COMMANDS, COMMAND_TYPES } from './types';

export const KEYBOARD_SHORTCUTS: COMMANDS = {
    '#': {
        type: COMMAND_TYPES.BLOCK,
        command: 'header-one',
    },
    '*': {
        type: COMMAND_TYPES.INLINE,
        command: 'BOLD',
    },
    '**': {
        type: COMMAND_TYPES.INLINE,
        command: 'COLOR_RED',
    },
    '***': {
        type: COMMAND_TYPES.INLINE,
        command: 'UNDERLINE',
    },
    '```': {
        type: COMMAND_TYPES.BLOCK,
        command: 'code-block',
    },
};
