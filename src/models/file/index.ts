import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Generated,
} from 'typeorm';

export enum FileField {
  id = 'id',
  data = 'data',
  fileId = 'fileId',
}

@Entity()
export class File extends BaseEntity {
  @PrimaryGeneratedColumn()
  [FileField.id]: number;

  @Column({ type: 'bytea' })
  [FileField.data]: ArrayBuffer;

  @Column({ type: 'string', readonly: true })
  @Generated('uuid')
  [FileField.fileId]: string;
}
