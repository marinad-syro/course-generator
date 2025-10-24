#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

echo "+++ BUILD START +++"

python -m pip install --upgrade pip
python -m pip install --no-cache-dir "psycopg[binary]==3.2.11" || true
python -m pip install --no-cache-dir -r requirements.txt

echo "+++ PACKAGES INSTALLED +++"

python manage.py collectstatic --no-input || true

# Print DB info (diagnostic)
echo "+++ DIAGNOSTIC: DATABASE_URL env var (if set) +++"
python - <<'PY'
import os
print("DATABASE_URL:", os.environ.get("DATABASE_URL"))
# Also print Django parsed DATABASES if possible
try:
    import django, sys
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "yourproject.settings")   # <-- REPLACE
    django.setup()
    from django.conf import settings
    print("Django DB engine:", settings.DATABASES.get('default', {}).get('ENGINE'))
    print("Django DB NAME:", settings.DATABASES.get('default', {}).get('NAME'))
except Exception as e:
    print("Could not import Django settings; error:", e)
PY

# Run migrations (must run before superuser creation)
echo "+++ RUNNING MIGRATIONS +++"
python manage.py migrate --no-input

echo "+++ MIGRATIONS DONE +++"

# Create/update superuser if requested
if [ "${CREATE_SUPERUSER:-}" = "true" ]; then
  echo "+++ CREATE_SUPERUSER IS TRUE - CREATING/UPDATING +++"
  python - <<'PY'
import os, django, sys
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "main_project.settings")  # <-- REPLACE
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()

u = os.environ.get("DJANGO_SUPERUSER_USERNAME")
e = os.environ.get("DJANGO_SUPERUSER_EMAIL", "")
p = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

if not (u and p):
    print("Missing DJANGO_SUPERUSER_USERNAME or DJANGO_SUPERUSER_PASSWORD; skipping.")
    sys.exit(0)

try:
    qs = User.objects.filter(username=u)
    if qs.exists():
        user = qs.first()
        user.set_password(p)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        print(f"Updated existing superuser: {u}")
    else:
        User.objects.create_superuser(username=u, email=e, password=p)
        print(f"Created new superuser: {u}")
except Exception as exc:
    print("ERROR creating superuser:", exc)

print("Superuser list:", list(User.objects.filter(is_superuser=True).values_list('username', flat=True)))
PY
fi

echo "+++ BUILD END +++"