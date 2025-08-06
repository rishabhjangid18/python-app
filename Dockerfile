# ---- Stage 1: Build/Install dependencies ----
FROM python:3.11-slim as builder

WORKDIR /app

# Install build tools (if needed for native packages)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Copy app source code
COPY . .

# ---- Stage 2: Distroless runtime ----
FROM gcr.io/distroless/python3

WORKDIR /app

# Copy python interpreter, site-packages and app
COPY --from=builder /install /usr/local
COPY --from=builder /app /app

# Expose the port your app uses
EXPOSE 80

# Run the app
CMD ["app.py"]
