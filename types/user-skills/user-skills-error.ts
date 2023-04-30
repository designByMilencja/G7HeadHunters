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

export interface ICsvSkillsErrors {
  email: ICsvValidation;
  courseCompletion: ICsvValidation;
  courseEngagement: ICsvValidation;
  projectDegree: ICsvValidation;
  teamProjectDegree: ICsvValidation;
  bonusProjectUrls: ICsvValidation[];
}
