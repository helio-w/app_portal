import os
import tempfile
from pathlib import Path
from unittest import mock

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase, override_settings

from apps.models import Application

User = get_user_model()

APPLICATIONS = "/api/applications/"


class ApplicationApiTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        Application.objects.create(title="Zeta", url="https://zeta.example")
        Application.objects.create(title="Alpha", url="https://alpha.example")
        cls.staff = User.objects.create_user("staff", password="pw", is_staff=True)
        cls.user = User.objects.create_user("user", password="pw")

    def post_app(self):
        return self.client.post(APPLICATIONS, {"title": "New", "url": "https://new.example"})

    def test_anyone_can_list_applications_sorted_by_title(self):
        response = self.client.get(APPLICATIONS)
        self.assertEqual(response.status_code, 200)
        self.assertEqual([app["title"] for app in response.json()], ["Alpha", "Zeta"])

    def test_anonymous_cannot_write(self):
        self.assertEqual(self.post_app().status_code, 403)

    def test_non_staff_cannot_write(self):
        self.client.force_login(self.user)
        self.assertEqual(self.post_app().status_code, 403)

    def test_staff_can_write(self):
        self.client.force_login(self.staff)
        self.assertEqual(self.post_app().status_code, 201)

    def test_dates_are_read_only(self):
        self.client.force_login(self.staff)
        response = self.client.post(
            APPLICATIONS,
            {"title": "New", "url": "https://new.example", "date_added": "2000-01-01T00:00:00Z"},
        )
        self.assertFalse(response.json()["date_added"].startswith("2000"))

    def test_featured_applications_are_listed_first(self):
        Application.objects.create(title="Mu", url="https://mu.example", featured=True)
        response = self.client.get(APPLICATIONS)
        self.assertEqual(
            [(app["title"], app["featured"]) for app in response.json()],
            [("Mu", True), ("Alpha", False), ("Zeta", False)],
        )

    def test_applications_are_not_featured_by_default(self):
        self.client.force_login(self.staff)
        self.assertFalse(self.post_app().json()["featured"])

    def test_staff_can_feature_an_application(self):
        self.client.force_login(self.staff)
        response = self.client.post(
            APPLICATIONS, {"title": "New", "url": "https://new.example", "featured": True}
        )
        self.assertTrue(response.json()["featured"])
        self.assertTrue(Application.objects.get(title="New").featured)


class CurrentUserApiTests(TestCase):
    def test_anonymous(self):
        response = self.client.get("/api/me/")
        self.assertEqual(
            response.json(), {"is_authenticated": False, "is_staff": False, "username": None}
        )

    def test_staff(self):
        self.client.force_login(User.objects.create_user("staff", password="pw", is_staff=True))
        response = self.client.get("/api/me/")
        self.assertEqual(
            response.json(), {"is_authenticated": True, "is_staff": True, "username": "staff"}
        )


class RoutingTests(TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.tmp = Path(tmp.name)

    def test_spa_is_served_for_frontend_routes(self):
        (self.tmp / "index.html").write_text("<div id='root'></div>")
        with override_settings(FRONTEND_DIST=self.tmp):
            for path in ["/", "/some/route", "/administration"]:
                with self.subTest(path=path):
                    response = self.client.get(path)
                    self.assertEqual(response.status_code, 200)
                    self.assertIn("csrftoken", response.cookies)

    def test_admin_without_slash_redirects_to_admin(self):
        self.assertRedirects(
            self.client.get("/admin"), "/admin/", status_code=301, fetch_redirect_response=False
        )

    def test_media_is_served(self):
        # The media URL captures MEDIA_ROOT at import time, so override_settings can't change it.
        media_root = Path(settings.MEDIA_ROOT)
        media_root.mkdir(parents=True, exist_ok=True)
        with tempfile.NamedTemporaryFile(dir=media_root, suffix=".png") as icon:
            icon.write(b"png")
            icon.flush()
            response = self.client.get(f"/media/{Path(icon.name).name}")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(b"".join(response.streaming_content), b"png")


class EnsureSuperuserTests(TestCase):
    ENV = {"DJANGO_SUPERUSER_USERNAME": "admin", "DJANGO_SUPERUSER_PASSWORD": "pw"}

    def run_command(self):
        call_command("ensure_superuser", stdout=open(os.devnull, "w"))

    def test_creates_the_superuser_once(self):
        with mock.patch.dict(os.environ, self.ENV):
            self.run_command()
            self.run_command()
        self.assertTrue(User.objects.get(username="admin").is_superuser)
        self.assertEqual(User.objects.count(), 1)

    def test_does_nothing_without_env(self):
        with mock.patch.dict(os.environ, {}, clear=True):
            self.run_command()
        self.assertFalse(User.objects.exists())
