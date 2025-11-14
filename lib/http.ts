type CustomOptions = RequestInit & { baseUrl?: string | undefined };

class HttpError extends Error {
  status: number;
  payload: any;
  constructor(status: number, payload: any) {
    super("HTTP Error");
    this.status = status;
    this.payload = payload;
  }
}

const request = async (
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: RequestInit | undefined
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined;
  const baseHeaders = {
    "Content-Type": "application/json",
  };
};
