export interface CustomError extends Error {
  status: number;
}

function error(message = "something went wrong", status = 500) {
  const e = new Error(message) as CustomError;
  e.status = status;
  return e;
}

export default error;
