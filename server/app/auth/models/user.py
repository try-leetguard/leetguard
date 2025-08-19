from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

# SQLAlchemy model representing a user in the system. Stores user ID, email, hashed password, and account creation time.
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)  # Unique user ID
    email = Column(String, unique=True, index=True, nullable=False)  # User's email address
    hashed_password = Column(String, nullable=False)  # Hashed password for authentication
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # Timestamp of account creation
    is_verified = Column(Boolean, default=False)  # Whether the user's email is verified
    verification_code = Column(String, nullable=True)  # 6-digit email verification code
    verification_code_expires = Column(DateTime(timezone=True), nullable=True)  # Expiration time for the code
    resend_cooldown_seconds = Column(Integer, default=30)  # Cooldown in seconds for resending code
    last_code_sent_at = Column(DateTime(timezone=True), nullable=True)  # Last time a code was sent
    display_name = Column(String, nullable=True)  # User's display name

    # Relationships
    blocklist_items = relationship("BlocklistItem", back_populates="user", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="user", cascade="all, delete-orphan")

class BlocklistItem(Base):
    __tablename__ = "blocklist_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    website = Column(String(255), nullable=False)  # e.g., "facebook.com", "netflix.com"
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    user = relationship("User", back_populates="blocklist_items")

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    problem_name = Column(String(255), nullable=False)  # e.g., "Two Sum", "Add Two Numbers"
    problem_url = Column(String(500), nullable=False)   # e.g., "https://leetcode.com/problems/two-sum/"
    difficulty = Column(String(10), nullable=False)     # "Easy", "Medium", "Hard"
    topic_tags = Column(Text, nullable=True)            # JSON string of tags
    status = Column(String(20), nullable=False)         # "solved", "attempted", "bookmarked"
    completed_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    user = relationship("User", back_populates="activities") 