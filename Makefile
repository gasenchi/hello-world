SHELL := /usr/bin/bash

.PHONY: dev migrate seed up down

up:
	@if command -v docker >/dev/null 2>&1; then \
		docker compose -f $(CURDIR)/docker-compose.yml up -d; \
	else \
		echo "Docker not found, skipping docker-compose up"; \
	fi

down:
	@if command -v docker >/dev/null 2>&1; then \
		docker compose -f $(CURDIR)/docker-compose.yml down -v; \
	else \
		echo "Docker not found, skipping docker-compose down"; \
	fi

dev: up
	npm install --ignore-scripts || true
	npm run dev

migrate:
	npm run migrate

seed:
	npm run seed
