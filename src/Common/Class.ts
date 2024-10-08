export class ProjectResponse<T> {
    data: T | null = null; // Initialize with null or a default value
    error: string = '';
}


export class MemberEditAuth {
    familyID: string = ""
    key: string = ""
    memberId: string = ""
    isAuthenticated: boolean = false
    userId: string = ""
}