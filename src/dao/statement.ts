export interface Statement {
  id: string;
  account: string;
  filename: string;
  uploadDate: Date;
}
  
// todo - initialize from filesystem
export let statements: Statement[] = [];