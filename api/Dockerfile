FROM python:3.14
WORKDIR /app

# 1. Install pipenv
RUN pip install pipenv

# 2. Copy dependency files
COPY Pipfile Pipfile.lock ./

# 3. Install dependencies from Pipfile into the system python
RUN pipenv install --system --deploy

# 4. Copy the rest of the code
COPY . ./

EXPOSE 5050

CMD ["python", "main.py"]