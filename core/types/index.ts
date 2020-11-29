export interface UserRegisterForm {
  username: string,
  password: string,
  givenName: string,
  familyName: string,
  email: string,
  birthdate: string,
  phoneNumber: string
}

export interface UserRegisterConfirmationForm {
  username: string,
  confirmationCode: string
}

export interface Crag {
  slug: string; 
  title: string; 
  climbCount: number; 
  areaCount: number; 
  tickCount: number; 
  likeCount: number;
}
