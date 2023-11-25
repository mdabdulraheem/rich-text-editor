export enum COMMAND_TYPES {
    INLINE,
    BLOCK,
}

export type COMMANDS = {
    [key: string]: {
        type: COMMAND_TYPES;
        command: string;
    };
};
