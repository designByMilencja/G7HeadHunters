import { NextFunction, Request, Response } from 'express';
import { UserDb } from '../models/UserSchema';
import { UserSkillDb } from '../models/UserSkillsSchema';
import { UserProfileDb } from '../models/UserProfileSchema';
import { InfoResponse, ProfileResponse } from '../types';
import { getGitHubUser } from '../utils/getGitHubUser';
import { ValidationError } from '../utils/handleError';

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    if (req.user._id.toString() !== id) {
      throw new ValidationError('Token not match to user');
    }

    const user = await UserDb.findById(id);
    if (!user) throw new ValidationError('User not found');

    const userData = await UserSkillDb.findOne({ email: user.email }).populate('profile');

    const info: InfoResponse = {
      avatar: userData.profile.githubAvatar,
      firstName: userData.profile.firstName,
      lastName: userData.profile.lastName,
      email: user.email,
      phone: userData.profile.phone,
      bio: userData.profile.bio,
      status: user.status,
    };

    const profile: ProfileResponse = {
      skills: {
        courseCompletion: userData.courseCompletion,
        courseEngagement: userData.courseEngagement,
        projectDegree: userData.projectDegree,
        teamProjectDegree: userData.teamProjectDegree,
      },
      expectations: {
        expectedTypeWork: userData.profile.expectedTypeWork,
        targetWorkCity: userData.profile.targetWorkCity,
        expectedContractType: userData.profile.expectedContractType,
        expectedSalary: userData.profile.expectedSalary,
        canTakeApprenticeship: userData.profile.canTakeApprenticeship,
        monthsOfCommercialExp: userData.profile.monthsOfCommercialExp,
      },
      education: userData.profile.education,
      courses: userData.profile.courses,
      workExperience: userData.profile.workExperience,
      portfolioUrls: userData.profile.portfolioUrls,
      bonusProjectUrls: userData.bonusProjectUrls,
      projectUrls: userData.profile.projectUrls,
    };

    res.status(200).send({ info, profile });
  } catch (err) {
    next(err);
  }
};

export const addUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const {
    email,
    phone,
    firstName,
    lastName,
    githubUsername,
    portfolioUrls,
    projectUrls,
    bio,
    expectedTypeWork,
    targetWorkCity,
    expectedContractType,
    expectedSalary,
    canTakeApprenticeship,
    monthsOfCommercialExp,
    education,
    workExperience,
    courses,
  } = req.body;

  try {
    if (req.user._id.toString() !== id) {
      throw new ValidationError('Token not match to user');
    }

    let githubAvatar = await getGitHubUser(githubUsername);
    if (!githubAvatar) githubAvatar = '';

    const userProfile = new UserProfileDb({
      email,
      phone,
      firstName,
      lastName,
      githubUsername,
      githubAvatar,
      portfolioUrls,
      projectUrls,
      bio,
      expectedTypeWork,
      targetWorkCity,
      expectedContractType,
      expectedSalary,
      canTakeApprenticeship,
      monthsOfCommercialExp,
      education,
      workExperience,
      courses,
    });

    const savedProfile = await userProfile.save();

    res.status(200).send(savedProfile);
  } catch (err) {
    next(err);
  }
};

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const {
    email,
    phone,
    firstName,
    lastName,
    githubUsername,
    portfolioUrls,
    projectUrls,
    bio,
    expectedTypeWork,
    targetWorkCity,
    expectedContractType,
    expectedSalary,
    canTakeApprenticeship,
    monthsOfCommercialExp,
    education,
    workExperience,
    courses,
  } = req.body;

  try {
    if (req.user._id.toString() !== id) {
      throw new ValidationError('Token not match to user');
    }

    const updatedProfile = await UserProfileDb.findOneAndUpdate(
      { email: req.user.email },
      {
        email,
        phone,
        firstName,
        lastName,
        githubUsername,
        portfolioUrls,
        projectUrls,
        bio,
        expectedTypeWork,
        targetWorkCity,
        expectedContractType,
        expectedSalary,
        canTakeApprenticeship,
        monthsOfCommercialExp,
        education,
        workExperience,
        courses,
      },
      { new: true }
    );

    res.status(200).send(updatedProfile);
  } catch (err) {
    next(err);
  }
};
