import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import {
  Session as ISession,
  Post as IPost,
  PostType,
} from 'retro-board-common';
import { User } from './User';
import { Session } from './Session';

@Entity()
export class Post {
  // implements IPost {
  @PrimaryColumn({ primary: true })
  public id: string;
  @Column()
  public postType: PostType;
  @ManyToOne(() => User, { eager: true })
  public user: User;
  @ManyToOne(() => Session)
  public session: Session;

  @ManyToMany(() => User, { eager: true })
  @JoinTable({
    name: 'post_likes',
    joinColumn: {
      name: 'post',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user',
      referencedColumnName: 'id',
    },
  })
  public likes: User[] | undefined;
  @ManyToMany(() => User, { eager: true })
  @JoinTable({
    name: 'post_dislikes',
    joinColumn: {
      name: 'post',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user',
      referencedColumnName: 'id',
    },
  })
  public dislikes: User[] | undefined;
  @Column()
  public content: string;

  constructor(user: User, session: Session) {
    this.id = '';
    this.postType = PostType.Well;
    this.user = user;
    this.session = session;
    this.content = '';
  }
}
