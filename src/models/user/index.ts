import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeUpdate,
  BeforeInsert,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { File } from '../file';
import { RefreshToken, RefreshTokenField } from '../refreshToken';
import * as moment from 'moment';

export const DublicateMessage =
  'User with $value already exists. Choose another name or email.';

export enum UserField {
  id = 'id',
  username = 'username',
  email = 'email',
  password = 'password',
  isActive = 'isActive',
  isOnline = 'isOnline',
  image = 'image',
  refreshToken = 'refreshToken',
  createdDate = 'createdDate',
}

function hash(data: string) {
  return new Promise<string>((resolve, reject) => {
    bcrypt.hash(data, 10, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}

@Entity({ orderBy: { [UserField.username]: 'ASC' } })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  [UserField.id]: number;

  @Column({ type: 'text', unique: true, nullable: false })
  [UserField.username]: string;

  @Column({ type: 'text', unique: true, nullable: false })
  [UserField.email]: string;

  @Column({ type: 'text', nullable: false })
  [UserField.password]: string;

  @Column({ type: 'boolean', default: false }) // defined to deactivate account if needed
  [UserField.isActive]: boolean;

  @Column({ type: 'boolean', default: false })
  [UserField.isOnline]: boolean;

  @Column({ type: 'date', nullable: true })
  [UserField.createdDate]: Date;

  @OneToOne(() => File, {
    cascade: true,
  })
  @JoinColumn()
  [UserField.image]: File;

  @OneToOne(
    () => RefreshToken,
    (refreshToken: RefreshToken) => refreshToken[RefreshTokenField.user],
    {
      cascade: true,
    },
  )
  @JoinColumn()
  [UserField.refreshToken]: RefreshToken;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPasswordOnCreate() {
    if (this[UserField.password]) {
      this[UserField.password] = await hash(this[UserField.password]);
    }
  }

  @BeforeInsert()
  onCreate() {
    this[UserField.createdDate] = moment().toDate();
  }
}
