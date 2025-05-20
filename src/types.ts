// First, let's create types.ts to define our types
// types.ts
export interface User {
    id: string;
    email: string;
    name?: string;
    isAdmin: boolean;
    roles?: Record<string, unknown>;
    permissions?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

export interface RecentSession {
    id: string;
    userId: string;
    userName: string;
    startTime: Date;
    duration: number;
    ipAddress: string;
    deviceInfo: string;
}

export interface IpChange {
    id: string;
    userId: string;
    userName: string;
    oldIp: string;
    newIp: string;
    timestamp: Date;
    location?: string;
}

export interface SystemHealth {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    apiLatency: number;
    uptime: number;
    status: 'healthy' | 'warning' | 'critical';
}

export interface DashboardSummary {
    totalUsers: number;
    totalSessions: number;
    totalMessages: number;
    activeUsers: number;
    recentSessions: RecentSession[];
    recentIpChanges: IpChange[];
    systemHealth: SystemHealth;
}
