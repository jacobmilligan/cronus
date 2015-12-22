INSERT INTO users (id, first_name, last_name, email, password) VALUES 
	(1, 'Jacob', 'Milligan', 'jacob@jacob.com', 'asfjsfakfas9asfasf9saf93932915lsaf/afkgo');

INSERT INTO projects (project_name, user_id, description, default_value) VALUES 
	('Test project', 1, 'My first test project', 24);

INSERT INTO tasks (task_name, project_name, user_id, description, value, start_time) VALUES
	('Draw circle', 'Test project', 1, 'Drawing a circle on paper', 10, '2015-12-21 15:10:00+11');

INSERT INTO tags VALUES
	(1, 'circle'),
	(1, 'drawing');