export enum NodeEnv {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

export enum UserRole {
  SUPER_ADMIN = "super-admin",
  ADMIN = "admin",
  AGENT = "agent",
  USER = "user",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BLOCKED = "blocked",
  DELETED = "deleted",
  PENDING = "pending",
  SUSPENDED = "suspended",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

export enum WalletType {
  AGENT = "agent",
  SYSTEM = "system",
  PERSONAL = "personal",
}

export enum WalletStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BLOCKED = "blocked",
}

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REVERSED = "reversed",
}

export enum TransactionType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  SEND_MONEY = "send-money",
  CASH_IN = "cash-in",
  CASH_OUT = "cash-out",
}

export enum TransactionReference {
  BANK = "bank",
  CARD = "card",
  WALLET = "wallet",
  AGENT = "agent",
}

export enum TransactionDirection {
  DEBIT = "debit",
  CREDIT = "credit",
  NONE = "none",
}
