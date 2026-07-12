export interface LoginReq {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResp {
  token: string;
  username: string;
  password: string;
  role?: string;
  id:number;
  rememberMe: boolean;
}