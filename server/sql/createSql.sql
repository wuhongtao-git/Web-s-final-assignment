drop database if EXISTS database_1;
create database database_1;
use database_1;

drop table if exists session_table;
create table session_table
(
    user_id int(20) not null,
    create_time timestamp not null default current_timestamp,
    session_id varchar(100),
    login_time varchar(100) comment '登录开始时间，用户操作后刷新',
   primary key(user_id)
)
CHARACTER SET=UTF8;

drop table if exists user_table;
create table user_table
(
    user_id int(20) not null auto_increment,
    create_time timestamp not null default current_timestamp,
    user_name VARCHAR(30) unique,
    user_type int(4) DEFAULT 0 comment '0: 游客， 1：真实用户',
    password VARCHAR(12),
    primary key(user_id)
)
CHARACTER SET=UTF8;

drop table if exists message_table;
create table message_table
(
    message_id int(20) not null auto_increment,
    user_id int(20) not null,
    create_time timestamp not null default current_timestamp,
    message text comment '消息体',
    primary key(message_id)
)
CHARACTER SET=UTF8;

drop table if exists comment_table;
create table comment_table
(
    comment_id int(20) not null auto_increment,
    message_id int(20) not null,
    user_id int(20) not null,
    create_time timestamp not null default current_timestamp,
    comment_message text comment '评论消息体',
    primary key(comment_id)
)
CHARACTER SET=UTF8;

drop table if exists collect_table;
create table collect_table
(
    collect_id int(20) not null auto_increment,
    message_id int(20) not null,
    user_id int(20) not null,
    create_time timestamp not null default current_timestamp,
    primary key(collect_id)
)
CHARACTER SET=UTF8;


