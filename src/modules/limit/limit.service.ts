import { TransactionType, UserRole } from "../../constants/enums";
import HTTP_STATUS from "../../constants/httpStatus";
import AppError from "../../utils/appError";
import { QueryBuilder } from "../../utils/queryBuilder";
import { ILimit } from "./limit.interface";
import { Limit } from "./limit.model";

const createLimit = async (payload: Partial<ILimit>) => {
  const existingLimit = await Limit.findOne({
    type: payload.type,
    role: payload.role,
  });

  if (existingLimit) {
    throw new AppError(HTTP_STATUS.CONFLICT, "Limit already exists.");
  }

  const limit = await Limit.create(payload);

  return limit;
};

const getAllLimits = async (query: Record<string, string>) => {
  const searchableFields = ["type", "isActive"];
  const queryBuilder = new QueryBuilder(Limit.find(), query)
    .filter()
    .search(searchableFields)
    .sort()
    .fields()
    .paginate();

  const limits = await queryBuilder.build();
  const meta = await queryBuilder.getMeta();

  return { data: limits, meta };
};

const getSingleLimit = async (params: Record<string, string>) => {
  const limit = await Limit.findOne({ type: params.type, role: params.role });

  if (!limit) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Limit not found.");
  }

  return limit;
};

const toggleLimitStatus = async (params: Record<string, string>) => {
  const limit = await Limit.findOne({ type: params.type, role: params.role });

  if (!limit) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Limit not found.");
  }

  limit.isActive = !limit.isActive;
  await limit.save();

  return limit;
};

const updateLimit = async (
  params: Record<string, string>,
  payload: Partial<ILimit>
) => {
  const limit = await Limit.findOne({
    type: params.type as TransactionType,
    role: params.role as UserRole,
  });

  if (!limit) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Limit not found.");
  }

  if (payload.type && payload.type !== params.type) {
    const existingLimit = await Limit.findOne({
      type: payload.type as TransactionType,
      role: params.role as UserRole,
    });

    if (existingLimit) {
      throw new AppError(HTTP_STATUS.CONFLICT, "Limit already exists.");
    }
  }

  const updatedLimit = await Limit.findOneAndUpdate(
    { type: params.type as TransactionType, role: payload.role as UserRole },
    {
      $set: payload,
    },
    { new: true, runValidators: true }
  );

  return updatedLimit;
};

const deleteLimit = async (params: Record<string, string>) => {
  const limit = await Limit.findOneAndDelete({
    type: params.type,
    role: params.role,
  });

  if (!limit) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Limit not found.");
  }

  return null;
};

export const limitService = {
  createLimit,
  getAllLimits,
  getSingleLimit,
  toggleLimitStatus,
  updateLimit,
  deleteLimit,
};
