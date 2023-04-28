export const HEADERFIELDS = [
  'email',
  'courseCompletion',
  'courseEngagement',
  'teamProjectDegree',
  'bonusProjectUrls',
  'projectDegree',
];

export interface ICsvValidation {
  field: string;
  error?: boolean;
  message?: string;
}

export interface ICsvHeaderErrors {
  field: string;
  errors?: ICsvValidation | undefined;
}
export interface ICsvSkillsErrors {
  email?: ICsvValidation;
  courseCompletion?: ICsvValidation;
  courseEngagement?: ICsvValidation;
  projectDegree?: ICsvValidation;
  teamProjectDegree?: ICsvValidation;
  bonusProjectUrls?: ICsvValidation[];
}
