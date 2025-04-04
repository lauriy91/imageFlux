export enum TaskStatus {
    PENDING = 'pending',
    FAILED = 'failed',
    COMPLETED = 'completed',
}

export interface PathResponse {
    resolution: string;
    path: ImagePath
};

export interface ImagePath {
    cloud: string;
    local: string;
}