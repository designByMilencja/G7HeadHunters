import {AdminEntity} from "../admin";
import {Types} from "mongoose"
export interface HrEntity extends AdminEntity {
    fullName: string,
    company: string;
    maxReservedStudents: number;
    users: Types.Array<string>;
}
