export interface Comment {
  id: string;
  text: string;
  author: string;
  clientId: string;
  createdAt: number;
}

export interface CreateCommentDto {
  text: string;
  author: string;
  clientId: string;
}
