CREATE TABLE employees (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    salary INT NOT NULL,
    bonus INT,
    joining_date DATE NOT NULL,
    department_id BIGINT NOT NULL REFERENCES department(id)
);

CREATE TABLE departments (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    no_of_employees INT NOT NULL check(no_of_employees >= 0) DEFAULT 0
);

INSERT INTO employees (
    name,
    email,
    salary,
	joining_date,
    department_id
)
VALUES
    (
        'George',
        'george@gmail.com',
        '100000',
		TO_DATE('2019-03-05', 'YYYY-MM-DD'),
        '1'
    ),
    (
        'Jack',
        'jack@gmail.com',
        '150000',
		TO_DATE('2020-04-26', 'YYYY-MM-DD'),
        '2'
    ),
    (
        'Jake',
        'jake@gmail.com',
        '170000',
		TO_DATE('2021-04-20', 'YYYY-MM-DD'),		
        '3'
    ),
	(
        'Michael',
        'michael@gmail.com',
        '270000',
		TO_DATE('2022-06-15', 'YYYY-MM-DD'),
        '4'
    ),
	(
        'Lalo',
        'lalo@gmail.com',
        '1000000',
		TO_DATE('2022-08-25', 'YYYY-MM-DD'),
        '5'
    )
;

INSERT INTO departments (name)
VALUES ('Project Manager'), ('Software Engineer'), ('Human Resources'), ('Office Adminstration'), ('Tech Lead');


CREATE FUNCTION employees_count_update_to_department()
    RETURNS TRIGGER
    LANGUAGE plpgsql AS
$func$
BEGIN
    CASE TG_OP
    WHEN 'INSERT' THEN           
        UPDATE departments AS d
        SET    no_of_employees = d.no_of_employees + 1
        WHERE  d.id = NEW.department_id; 
    WHEN 'DELETE' THEN
        UPDATE departments AS d
        SET    no_of_employees = d.no_of_employees - 1
        WHERE  d.id = OLD.department_id
        AND    d.no_of_employees > 0;
    ELSE
        RAISE EXCEPTION 'Unexpected TG_OP: "%". Should not occur!', TG_OP;
    END CASE;

    RETURN NULL;   
END
$func$;


CREATE TRIGGER no_of_employees_count_update
    AFTER INSERT OR DELETE
    ON employees
    FOR EACH ROW
    EXECUTE PROCEDURE employees_count_update_to_department();




