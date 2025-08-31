FROM python:3.10-slim
WORKDIR /app
COPY app.py requirements.txt /app/
RUN pip install -r requirements.txt
ENV PYTHONUNBUFFERED=1
EXPOSE 5000
ENV FLASK_APP=app.py
# CMD ["flask", "run", "--host", "0.0.0.0", "--port", "5000"]
ENTRYPOINT ["python", "app.py"]
