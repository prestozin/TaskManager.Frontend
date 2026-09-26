export class Messages {

  static readonly RequiredField = 'Campo obrigatório.';
  static readonly InvalidEmail = 'Digite um e-mail válido.';
  static readonly PasswordsDoNotMatch = 'As senhas não coincidem.';
  static readonly UnexpectedError = 'Ocorreu um erro inesperado.';

  static readonly TaskCreatedSuccessfully = 'Tarefa criada com sucesso.';
  static readonly TaskCreateFailed = 'Não foi possível adicionar a tarefa.';
  static readonly TaskEditedSuccessfully = 'Tarefa editada com sucesso.';
  static readonly TaskEditFailed = 'Não foi possível editar a tarefa.';
  static readonly TaskDeletedSuccessfully = 'Tarefa deletada com sucesso.';
  static readonly TaskDeleteFailed = 'Não foi possível deletar a tarefa.';

  static readonly DeleteTaskTitle = 'Excluir tarefa?';
  static readonly DeleteTasksTitle = 'Excluir tarefas selecionadas?';
  static readonly IrreversibleAction = 'Essa ação não poderá ser desfeita.';
  static readonly DeleteButton = 'Excluir';

  static readonly DeleteAccountTitle = 'Excluir conta';
  static readonly DeleteAccountConfirmation = 'Tem certeza que deseja excluir sua conta? Esta ação não poderá ser desfeita.';
  static readonly DeleteAccountConfirmButton = 'Excluir conta';
  static readonly CancelButton = 'Cancelar';

  static minimumLength(requiredLength: number): string {
    return `O campo deve ter pelo menos ${requiredLength} caracteres.`;
  }

  static maximumLength(requiredLength: number): string {
    return `O campo deve ter no máximo ${requiredLength} caracteres.`;
  }

  static passwordMinimumLength(requiredLength: number): string {
    return `A senha deve ter pelo menos ${requiredLength} caracteres.`;
  }
}
