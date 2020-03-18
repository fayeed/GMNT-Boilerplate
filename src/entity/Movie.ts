import { Entity, Column, BaseEntity, ObjectIdColumn, ObjectID } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class Movie extends BaseEntity {
  @Field(() => Int)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  title: string;

  @Field(() => Int)
  @Column("int", { default: 60 })
  minutes: number;

  @Field()
  @Column(_ => User)
  user: User;
}
