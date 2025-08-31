FROM python:3.9-slim-buster
WORKDIR /app
COPY app.py requirements.txt /app/
COPY templates/ /app/templates/
COPY emailNotify/ /app/emailNotify/
RUN pip install -r requirements.txt
EXPOSE 5000
ENV FLASK_APP=app.py
CMD ["flask", "run", "--host", "0.0.0.0"]
