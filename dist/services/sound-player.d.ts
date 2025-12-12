type SoundName = 'victory' | 'failure' | 'click';
export declare function playSound(name: SoundName, opts?: {
    volume?: number;
    rate?: number;
    loop?: boolean;
}): Promise<void>;
export declare function preloadSounds(names?: SoundName[]): Promise<void>;
/** Call this once on a user gesture (click/tap) to satisfy iOS autoplay rules. */
export declare function unlockAudio(): Promise<void>;
export {};
