import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Session as ISession, Post as IPost } from 'retro-board-common';
import { Post } from './Post';

@Entity()
export class Session {
  // implements ISession {
  @PrimaryColumn({ primary: true })
  public id: string;
  @Column()
  public name: string;
  @OneToMany(() => Post, post => post.session, { eager: true })
  posts: Post[] | undefined;

  constructor() {
    this.id = '';
    this.name = '';
    // this.posts = [];
  }
}
