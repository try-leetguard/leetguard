"""
Pytest configuration and common fixtures for LeetGuard tests.
"""
import os
import sys
import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event, text
from sqlalchemy.engine import make_url
from sqlalchemy.orm import sessionmaker


# Add the app directory to the Python path before app imports.
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

os.environ.setdefault("SECRET_KEY", "test-secret-key")
os.environ.setdefault("REFRESH_SECRET_KEY", "test-refresh-secret-key")
os.environ.setdefault("RESEND_API_KEY", "test-resend-api-key")
os.environ.setdefault("FROM_EMAIL", "test@example.com")
os.environ.setdefault("FRONTEND_URL", "https://test.com")
os.environ.setdefault("JWT_ISSUER", "leetguard-test-api")
os.environ.setdefault("JWT_AUDIENCE", "leetguard-test-client")

_POSTGRES_CONTAINER = None
_TEST_SCHEMA = f"test_{uuid.uuid4().hex}"


def _start_postgres_container():
    try:
        from testcontainers.postgres import PostgresContainer
    except ImportError as exc:
        raise RuntimeError(
            "TEST_DATABASE_URL is not set and testcontainers is not installed. "
            "Install testcontainers or set TEST_DATABASE_URL to a PostgreSQL database."
        ) from exc

    container = PostgresContainer("postgres:16-alpine")
    try:
        container.start()
    except Exception as exc:
        raise RuntimeError(
            "TEST_DATABASE_URL is not set and a temporary PostgreSQL container could not be started. "
            "Start Docker or set TEST_DATABASE_URL to a PostgreSQL database."
        ) from exc
    return container


def _base_test_database_url():
    global _POSTGRES_CONTAINER
    configured_url = os.getenv("TEST_DATABASE_URL")
    if configured_url:
        return configured_url

    _POSTGRES_CONTAINER = _start_postgres_container()
    return _POSTGRES_CONTAINER.get_connection_url()


def _with_schema_search_path(database_url: str, schema: str) -> str:
    url = make_url(database_url)
    if url.get_backend_name() not in {"postgresql", "postgres"}:
        raise RuntimeError("Backend tests require PostgreSQL. Set TEST_DATABASE_URL to a PostgreSQL URL.")

    query = dict(url.query)
    query["options"] = f"-csearch_path={schema}"
    return url.set(query=query).render_as_string(hide_password=False)


_BASE_DATABASE_URL = _base_test_database_url()
_ADMIN_ENGINE = create_engine(_BASE_DATABASE_URL, isolation_level="AUTOCOMMIT")
with _ADMIN_ENGINE.connect() as connection:
    connection.execute(text(f'CREATE SCHEMA IF NOT EXISTS "{_TEST_SCHEMA}"'))

TEST_DATABASE_URL = _with_schema_search_path(_BASE_DATABASE_URL, _TEST_SCHEMA)
os.environ["DATABASE_URL"] = TEST_DATABASE_URL

from app.auth.models.user import Base
from app.db.session import get_db
from app.main import app


def _truncate_tables(session):
    table_names = [f'"{table.name}"' for table in reversed(Base.metadata.sorted_tables)]
    if table_names:
        session.execute(text(f"TRUNCATE TABLE {', '.join(table_names)} RESTART IDENTITY CASCADE"))
        session.commit()


@pytest.fixture(scope="session")
def test_engine():
    engine = create_engine(TEST_DATABASE_URL)

    @event.listens_for(engine, "connect")
    def set_search_path(dbapi_connection, _connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute(f'SET search_path TO "{_TEST_SCHEMA}"')
        cursor.close()

    Base.metadata.create_all(bind=engine)
    yield engine
    engine.dispose()


@pytest.fixture(scope="session", autouse=True)
def cleanup_test_database(test_engine):
    yield
    with _ADMIN_ENGINE.connect() as connection:
        connection.execute(text(f'DROP SCHEMA IF EXISTS "{_TEST_SCHEMA}" CASCADE'))
    _ADMIN_ENGINE.dispose()
    if _POSTGRES_CONTAINER is not None:
        _POSTGRES_CONTAINER.stop()


@pytest.fixture
def db_session(test_engine):
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    session = TestingSessionLocal()
    _truncate_tables(session)
    try:
        yield session
    finally:
        session.rollback()
        _truncate_tables(session)
        session.close()


@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def test_user_data():
    return {
        "email": "test@example.com",
        "password": "testpassword123"
    }


@pytest.fixture
def test_verification_data():
    return {
        "email": "test@example.com",
        "code": "123456"
    }


@pytest.fixture
def mock_env_vars(monkeypatch):
    monkeypatch.setenv("SECRET_KEY", "test-secret-key")
    monkeypatch.setenv("REFRESH_SECRET_KEY", "test-refresh-secret-key")
    monkeypatch.setenv("RESEND_API_KEY", "test-resend-api-key")
    monkeypatch.setenv("FROM_EMAIL", "test@example.com")
    monkeypatch.setenv("FRONTEND_URL", "https://test.com")
    monkeypatch.setenv("DATABASE_URL", TEST_DATABASE_URL)
