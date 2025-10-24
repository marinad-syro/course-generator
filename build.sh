#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

# make pip stable & fresh
python -m pip install --upgrade pip

# install psycopg v3 binary first (pin a known good release)
python -m pip install --no-cache-dir "psycopg[binary]==3.2.11"

# then install the rest of your project's deps
python -m pip install --no-cache-dir -r requirements.txt

# collect static and run migrations
python manage.py collectstatic --no-input
python manage.py migrate