import { TransactionType } from "../../constants/enums";
import HTTP_STATUS from "../../constants/httpStatus";
import AppError from "../../utils/appError";
import { QueryBuilder } from "../../utils/queryBuilder";
import { ICommission } from "./commission.interface";
import { Commission } from "./commission.model";

const createCommission = async (payload: ICommission) => {
  const existingCommission = await Commission.findOne({ type: payload.type });

  if (existingCommission) {
    throw new AppError(HTTP_STATUS.CONFLICT, "Commission already exists.");
  }

  const commission = await Commission.create(payload);

  return commission;
};

const getAllCommissions = async (query:Record<string, string>) => {
  const searchableFields = ["type", "isActive"];
  const queryBuilder = new QueryBuilder(Commission.find(), query)
    .filter()
    .search(searchableFields)
    .sort()
    .fields()
    .paginate();

  const commissions = await queryBuilder.build();
  const meta = await queryBuilder.getMeta();

  return { data: commissions, meta };
};

const getSingleCommission = async (type: TransactionType) => {
  const commission = await Commission.findOne({ type });

  if (!commission) {
    console.log("Commission not found.");
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Commission not found.");
  }

  return commission;
};

const toggleCommissionStatus = async (type: TransactionType) => {
  const commission = await Commission.findOne({ type });

  if (!commission) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Commission not found.");
  }

  commission.isActive = !commission.isActive;
  await commission.save();

  return commission;
};

const updateCommission = async (
  type: TransactionType,
  payload: ICommission
) => {
  const commission = await Commission.findOne({ type });

  if (!commission) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Commission not found.");
  }

  if (payload.type && payload.type !== type) {
    const existingCommission = await Commission.findOne({
      type: payload.type,
    });

    if (existingCommission) {
      throw new AppError(HTTP_STATUS.CONFLICT, "Commission already exists.");
    }
  }

  const updatedCommission = await Commission.findOneAndUpdate(
    { type },
    {
      $set: payload,
    },
    { new: true, runValidators: true }
  );

  return updatedCommission;
};

const deleteCommission = async (type: TransactionType) => {
  const commission = await Commission.findOneAndDelete({ type });

  if (!commission) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Commission not found.");
  }

  return null;
};

export const commissionService = {
  createCommission,
  getAllCommissions,
  getSingleCommission,
  toggleCommissionStatus,
  updateCommission,
  deleteCommission,
};
