export interface RegisterUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}
