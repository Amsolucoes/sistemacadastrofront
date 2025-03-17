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

  // Adicionar propriedades temporárias
  tempoRestante?: number;  // Tempo restante para cada cliente
  tempoMensagem?: string;  // Mensagem de tempo
  intervalo?: any;         // Para armazenar o intervalo de contagem
  toastExibido?: boolean; // Adicione esta linha
}
