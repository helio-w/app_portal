FROM python:3.14-slim

WORKDIR /app

# Update system
RUN apt update && apt upgrade -y --no-install-recommends

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip \
    && pip install  --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

RUN chmod +x /app/entrypoint.sh

#RUN useradd app
#USER app

# Run Gunicorn as the production WSGI server.
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["gunicorn", "app_portal.wsgi", "--bind", "0.0.0.0:8000"]