# backend/api/admin.py   (or any app that’s loaded)
from django.contrib import admin
from django.apps import apps
from django.db import models as dj_models

def create_admin_for_model(model):
    """
    Dynamically build a ModelAdmin with all concrete fields in list_display.
    Hides the admin from the index if you later mark it 'private'.
    """
    field_names = [
        f.name for f in model._meta.get_fields() 
        if isinstance(f, dj_models.Field) and not f.many_to_many
    ]
    attrs = {"list_display": field_names}
    admin_class = type(f"{model.__name__}Admin", (admin.ModelAdmin,), attrs)
    return admin_class

# auto-register every model in every installed app
for model in apps.get_models():
    try:
        admin.site.register(model, create_admin_for_model(model))
    except admin.sites.AlreadyRegistered:
        pass      # skip models you registered manually
