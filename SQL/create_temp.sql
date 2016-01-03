CREATE TABLE active_tasks(
user_id			integer,
task_name		varchar(125),
project_name	varchar(125),
value 			money,
start_time		TIMESTAMP WITH TIME ZONE NOT NULL,
end_time		TIMESTAMP WITH TIME ZONE,
elapsed			interval DEFAULT '0 0:00:00' NOT NULL,
PRIMARY KEY(user_id),
FOREIGN KEY(user_id) REFERENCES users(id)
);