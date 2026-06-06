# Builds image of backend

FROM python:3.14.5
WORKDIR /app
COPY ./backend/requirements.txt requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt
COPY ./backend .
CMD ["gunicorn", "--bind", "0.0.0.0:80", "app:app"]