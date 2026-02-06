import { httpStatusText } from "../utils/httpStatusText.js";

export type ApiStatus = httpStatusText.SUCCESS | httpStatusText.ERROR;

export interface ApiResponse<T> {
  status: ApiStatus;
  message: string;
  data: T | null;
  meta: any;
}

export interface UserBasicInfo {
  id: string;
  email: string;
  name: string | null;
}

export interface SearchResults {
  count: number;
  query: string;
  results: any[];
}
