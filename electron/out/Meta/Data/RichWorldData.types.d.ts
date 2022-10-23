export declare type RichChunk = Record<string, any>;
export declare type RichColumn = {
    chunks: Record<string, RichChunk>;
};
export declare type RichRegion = {
    columns: Record<string, RichColumn>;
};
export declare type RichWorldDimensions = Record<string, Record<string, RichRegion>>;
