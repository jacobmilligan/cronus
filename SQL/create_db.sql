CREATE TABLE users(
id				serial,
first_name		varchar(25) NOT NULL,
last_name		varchar(40),
email			varchar(50) NOT NULL,
password		text NOT NULL,
PRIMARY KEY(id)	
);

CREATE TABLE projects(
project_name	varchar(125),
user_id			integer,
description		text,
default_value	money,
PRIMARY KEY(project_name, user_id),
FOREIGN KEY(user_id) REFERENCES users (id)	
);

CREATE TABLE tasks(
task_name		varchar(125),
project_name	varchar(125),
user_id			integer,
description		text,
value 			money,
start_time		TIMESTAMP WITH TIME ZONE NOT NULL,
end_time		TIMESTAMP WITH TIME ZONE,
elapsed			interval DEFAULT '0 0:00:00' NOT NULL,
PRIMARY KEY(task_name, project_name, user_id),
FOREIGN KEY(project_name, user_id) REFERENCES projects (project_name, user_id)
);

CREATE TABLE tags(
creator_id		integer,
content			varchar(100),
PRIMARY KEY(creator_id, content),
FOREIGN KEY(creator_id) REFERENCES users(id)
);

CREATE TABLE project_tags(
creator_id		integer,
content			varchar(100),
user_id			integer,
project_name	varchar(125),
PRIMARY KEY(content, user_id, project_name),
FOREIGN KEY(creator_id, content) REFERENCES tags (creator_id, content),
FOREIGN KEY(user_id, project_name) REFERENCES projects (user_id, project_name)
);

CREATE TABLE task_tags(
creator_id		integer,
content			varchar(100),
user_id			integer,
project_name	varchar(125),
task_name		varchar(125),
PRIMARY KEY(content, user_id, project_name, task_name),
FOREIGN KEY(creator_id, content) REFERENCES tags (creator_id, content),
FOREIGN KEY(user_id, project_name, task_name) REFERENCES tasks (user_id, project_name, task_name)
);