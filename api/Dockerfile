FROM python:3.11

WORKDIR /app

RUN pip install --no-cache-dir pipenv

COPY Pipfile Pipfile.lock ./

# 🔥 IMPORTANT FIX
RUN pipenv install --system --ignore-pipfile

COPY . .

EXPOSE 5050

CMD ["python", "main.py"]