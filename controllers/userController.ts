import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserDb } from '../models/UserSchema';
import { UserSkillDb } from '../models/UserSkillsSchema';
import { UserProfileDb } from '../models/UserProfileSchema';
import { DecodedToken } from '../types';
import { getGitHubUser } from '../utils/getGitHubUser';
import { userInfo, userProfile } from '../utils/filterResponse';
import { ValidationError } from '../utils/handleError';

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    if (req.user._id.toString() !== id) {
      throw new ValidationError('Nieautoryzowany użytkownik.');
    }

    const user = await UserDb.findById(id);
    if (!user) throw new ValidationError('Nie znaleziono użytkownika o podanym ID.');

    const userData = await UserSkillDb.findOne({ email: user.email }).populate('profile');

    const info = userInfo(userData, user);
    const profile = userProfile(userData);

    res.status(200).send({ info, profile });
  } catch (err) {
    next(err);
  }
};

export const addUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { id, token } = req.params;

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
    if (!token) throw new ValidationError('Nie przesłano tokena.');

    jwt.verify(token, process.env.JWT_SECRET, (err: jwt.VerifyErrors, decoded: DecodedToken) => {
      if (err) {
        return res.status(403).send({ message: 'Nieprawidłowy token.' });
      }
      if (decoded._id !== id) {
        return res.status(401).send({ message: 'Nieautoryzowany użytkownik.' });
      }
    });

    const user = await UserDb.findOne({ email, token });
    if (!user) throw new ValidationError('Nie znaleziono użytkownika.');

    const githubAvatar = await getGitHubUser(githubUsername);

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

    user.token = null;
    user.active = true;
    user.save();

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
      throw new ValidationError('Nieautoryzowany użytkownik.');
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
