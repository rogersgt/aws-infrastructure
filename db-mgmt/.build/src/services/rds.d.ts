export declare function listSystemSnapshots(): Promise<import("@aws-sdk/client-rds").DBInstanceAutomatedBackup[]>;
export declare function deleteSystemSnapshot(arn: string): Promise<void>;
export declare function updateRootPassword(instanceId: string, newPassword: string): Promise<import("@aws-sdk/client-rds").ModifyDBInstanceCommandOutput>;
