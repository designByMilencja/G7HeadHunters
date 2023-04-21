import {Types} from "mongoose";

export interface UserProfileEntity {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    githubUsername: string;
    portfolioUrls: Types.Array<string>;
    projectUrls: Types.Array<string>;
    bio: string;
    expectedTypeWork: string;
    targetWorkCity: string;
    expectedContractType: string;
    expectedSalary: string;
    canTakeApprenticeship: string;
    monthsOfCommercialExp: number;
    education: string;
    workExperience: string
    courses: string;
}
