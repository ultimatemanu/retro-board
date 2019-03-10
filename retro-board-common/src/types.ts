export interface Session {
  id: string;
  name: string;
  posts: Post[];
}

export interface Post {
  id: string;
  postType: PostType;
  content: string;
  user: string;
  likes: string[];
  dislikes: string[];
}

export enum PostType {
  Well = 'well',
  NotWell = 'notWell',
  Ideas = 'ideas',
}
