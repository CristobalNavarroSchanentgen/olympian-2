export * from './utils/event-bus';
export declare const SHARED_PACKAGE_CONFIG: {
    readonly name: "@olympian/shared";
    readonly version: "1.0.0";
    readonly architecture: "ai-native-contracts";
    readonly layer_hierarchy: readonly ["experience", "features", "services", "events", "models", "utils"];
};
export interface ContractManifest {
    name: string;
    version: string;
    architecture_type: string;
    contracts: Record<string, any>;
}
export declare function validateContractIntegrity(): boolean;
//# sourceMappingURL=index.d.ts.map