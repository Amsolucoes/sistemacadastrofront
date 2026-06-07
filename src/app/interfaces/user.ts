export interface User {
  name: string,
  email: string,
  cash: string,
  phone: string,
  estado: string,
  typePlan: string,
  firebaseId?: string,
  healthPlan?: string,
  dentalPlan?: string,
  comentario?: string,
  createdAt?: Date;
}
