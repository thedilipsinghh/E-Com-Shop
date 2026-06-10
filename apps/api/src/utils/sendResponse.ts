interface ResponseData {
  success: boolean;
  message: string;
  data?: any;
  meta?: any;
}

export const sendResponse = (
  res: any,
  responseData: ResponseData,
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: responseData.success,
    message: responseData.message,
    data: responseData.data || {},
    meta: responseData.meta || {}
  });
};