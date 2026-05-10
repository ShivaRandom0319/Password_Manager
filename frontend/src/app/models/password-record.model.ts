export interface PasswordRecord {
  id: number;
  name: string;
  username: string;
  password: string;
}

export interface PasswordRecordRequest {
  name: string;
  username: string;
  password: string;
}
