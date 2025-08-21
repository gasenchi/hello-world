SHELL := /usr/bin/bash

.PHONY: dev migrate seed up down

up:
	docker compose -f $(CURDIR)/docker-compose.yml up -d

down:
	docker compose -f $(CURDIR)/docker-compose.yml down -v

dev: up
	npm ci --ignore-scripts || true
	npm run dev

migrate:
	npm run migrate

seed:
	npm run seed
