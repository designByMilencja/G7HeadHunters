import {Types} from "mongoose";
import {AdminEntity} from "../admin";

export interface UserEntity extends AdminEntity{
    active: boolean;
    status: string;
    courseCompletion: number;
    courseEngagement: number;
    projectDegree: number;
    teamProjectDegree: number;
    bonusProjectUrls: Types.Array<string>
}
