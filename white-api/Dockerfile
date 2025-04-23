FROM python:3.10.12

WORKDIR /app

COPY requirements.txt .

RUN python3 -m venv.venv
RUN python3 install pip
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python3", "worker.py"]