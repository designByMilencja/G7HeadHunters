export const HEADERFIELDS = [
  'email',
  'courseCompletion',
  'courseEngagement',
  'teamProjectDegree',
  'bonusProjectUrls',
  'projectDegree',
];

export interface ICsvValidation {
  row?: number;
  field: string;
  message: string;
}

interface CsvSkillsErrors {
  email: ICsvValidation;
  courseCompletion: ICsvValidation;
  courseEngagement: ICsvValidation;
  projectDegree: ICsvValidation;
  teamProjectDegree: ICsvValidation;
  bonusProjectUrls: ICsvValidation[];
}

export interface ICsvSkillsErrors extends CsvSkillsErrors {
  [key: string]: ICsvValidation | ICsvValidation[];
}
