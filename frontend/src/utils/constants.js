// Application constants
export const ITEM_CATEGORIES = [
  "books",
  "electronics",
  "furniture",
  "clothing",
  "other",
];

export const ITEM_CONDITIONS = ["new", "like-new", "good", "fair", "poor"];

export const ITEM_STATUS = {
  AVAILABLE: "available",
  SOLD: "sold",
};

export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};

export const API_URL = import.meta.env.VITE_API_URL || "/api";

export const DEFAULT_PROFILE_IMAGE = "/assets/default-profile.png";
export const DEFAULT_ITEM_IMAGE = "/assets/default-item.png";
