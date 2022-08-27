CREATE TABLE departments (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    no_of_employees INT NOT NULL check(no_of_employees >= 0) DEFAULT 0
);


CREATE TABLE employees (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    salary INT NOT NULL,
    bonus INT,
    joining_date DATE NOT NULL,
    department_id BIGINT NOT NULL REFERENCES departments(id)
);


CREATE FUNCTION employees_count_update_department()
    RETURNS TRIGGER AS $$
    BEGIN
	IF (TG_OP = 'INSERT') THEN          
        UPDATE public.departments AS d
        SET    no_of_employees = d.no_of_employees + 1
        WHERE  d.id = NEW.department_id;
        RETURN NEW; 
    ELSEIF (TG_OP = 'DELETE') THEN
        UPDATE public.departments AS d
        SET    no_of_employees = d.no_of_employees - 1
        WHERE  d.id = OLD.department_id
        AND    d.no_of_employees > 0;
        RETURN NEW;	
    ELSE
        RAISE EXCEPTION 'Unexpected TG_OP: "%". Should not occur!', TG_OP;
    END IF; 
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER no_of_employees_count_update
    AFTER INSERT OR DELETE
    ON public.employees
    FOR EACH ROW
    EXECUTE FUNCTION employee_count_update_department();






INSERT INTO departments (name)
VALUES ('Project Manager'), ('Software Engineer'), ('Human Resources'), ('Office Adminstration'), ('Tech Lead');

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

