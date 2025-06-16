"""
Auto-selects dev or prod settings.

Priority:
1. DJANGO_SETTINGS_MODULE  (explicit path)
2. DJANGO_ENV=dev|prod     (one-word flag)
3. DJANGO_DEBUG=True in .env  -> dev   else -> prod
"""
import importlib, os
from pathlib import Path
from environs import Env   # pip install environs

if "DJANGO_SETTINGS_MODULE" in os.environ:
    module = os.environ["DJANGO_SETTINGS_MODULE"]
else:
    env_flag = os.getenv("DJANGO_ENV")
    if env_flag:
        module = f"project.settings.{env_flag.lower()}"
    else:
        env = Env()
        env.read_env(path=str(Path(__file__).resolve().parent.parent.parent / ".env"),
                     recurse=False)
        module = "project.settings.dev" if env.bool("DJANGO_DEBUG", False) \
                                         else "project.settings.prod"

globals().update({
    k: v for k, v in importlib.import_module(module).__dict__.items() if k.isupper()
})
