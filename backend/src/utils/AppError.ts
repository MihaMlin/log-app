import { AppErrorCode } from "../constants/appErrorCode";
import { HTTPSTATUS } from "../constants/http";

class AppError extends Error {
  constructor(
    public statusCode: HTTPSTATUS,
    public message: string,
    public errorCode?: AppErrorCode
  ) {
    super(message);
  }
}

export default AppError;
