import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Session as ISession, Post as IPost } from 'retro-board-common';

@Entity()
export class User {
  @PrimaryColumn({ primary: true })
  public id: string;
  @Column()
  public name: string;

  constructor() {
    this.id = '';
    this.name = '';
  }
}
