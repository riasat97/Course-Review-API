import { Types } from 'mongoose';

export type TTags = {
  name: string;
  isDeleted: boolean;
};

export type TDetails = {
  level: CourseLevel;
  description: string;
};

/* eslint-disable no-unused-vars */
export enum CourseLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

export type TCourse = {
  title: string;
  instructor: string;
  categoryId: Types.ObjectId;
  price: number;
  tags: [TTags];
  startDate: string;
  endDate: string;
  language: string;
  provider: string;
  details: TDetails;
  durationInWeeks: number;
  createdBy?: Types.ObjectId;
};
