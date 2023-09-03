export declare function listSystemSnapshots(): Promise<import("@aws-sdk/client-rds").DBInstanceAutomatedBackup[]>;
export declare function deleteSystemSnapshot(arn: string): Promise<void>;
