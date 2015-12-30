CREATE TABLE tasks(
task_name		varchar(125),
project_name	varchar(125),
user_id			integer,
description		text,
value 			money,
start_time		TIMESTAMP WITH TIME ZONE NOT NULL,
end_time		TIMESTAMP WITH TIME ZONE,
elapsed			interval DEFAULT '0 0:00:00' NOT NULL,
PRIMARY KEY(task_name, project_name, user_id, start_time),
FOREIGN KEY(project_name, user_id) REFERENCES projects (project_name, user_id)
);

CREATE TABLE task_tags(
creator_id		integer,
content			varchar(100),
user_id			integer,
project_name	varchar(125),
task_name		varchar(125),
start_time		TIMESTAMP WITH TIME ZONE NOT NULL,
PRIMARY KEY(content, user_id, project_name, task_name),
FOREIGN KEY(creator_id, content) REFERENCES tags (creator_id, content),
FOREIGN KEY(user_id, project_name, task_name, start_time) REFERENCES tasks (user_id, project_name, task_name, start_time)
);