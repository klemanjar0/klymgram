import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
} from 'typeorm';
import { User, UserField } from '../user';

export enum RefreshTokenField {
  id = 'id',
  refreshToken = 'refreshToken',
  expireTime = 'expireTime',
  user = 'user',
}

@Entity()
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  [RefreshTokenField.id]: number;

  @Column({ type: 'text', nullable: false })
  [RefreshTokenField.refreshToken]: string;

  @OneToOne(() => User, (user: User) => user[UserField.refreshToken])
  [RefreshTokenField.user]: User;
}
