/**
 * Contains utils for working with URL strings.
 */
export declare type RuntimeConfigOverrides = {
    data?: string;
    cr_user_id?: string;
    userSource?: string;
    requiredScore?: string;
    nextAssessment?: string;
    endpoint?: string;
    organization?: string;
};
export declare function configureRuntimeConfig(overrides?: RuntimeConfigOverrides): void;
export declare function resetRuntimeConfig(): void;
export declare function getAppType(): string;
export declare function getUUID(): string;
export declare function getUserSource(): string;
export declare function getDataFile(): string;
export declare function getAppLanguageFromDataURL(appType: string): string;
export declare function getAppTypeFromDataURL(appType: string): string;
export declare function getRequiredScore(): string;
export declare function getNextAssessment(): string;
export declare function getEndpoint(): string;
export declare function getOrganization(): string;
