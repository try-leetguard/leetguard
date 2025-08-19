from sqlalchemy.orm import Session
from app.auth.models.user import BlocklistItem, Activity
from app.auth.schemas.data import BlocklistItemCreate, ActivityCreate, ActivityUpdate
import json
from typing import List, Optional

# Blocklist CRUD operations
def create_blocklist_item(db: Session, user_id: int, website: str) -> BlocklistItem:
    """Create a new blocklist item for a user"""
    db_item = BlocklistItem(user_id=user_id, website=website)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_user_blocklist(db: Session, user_id: int) -> List[BlocklistItem]:
    """Get all blocklist items for a user"""
    return db.query(BlocklistItem).filter(BlocklistItem.user_id == user_id).all()

def get_blocklist_item(db: Session, item_id: int, user_id: int) -> Optional[BlocklistItem]:
    """Get a specific blocklist item by ID and user"""
    return db.query(BlocklistItem).filter(
        BlocklistItem.id == item_id,
        BlocklistItem.user_id == user_id
    ).first()

def delete_blocklist_item(db: Session, item_id: int, user_id: int) -> bool:
    """Delete a blocklist item"""
    item = get_blocklist_item(db, item_id, user_id)
    if item:
        db.delete(item)
        db.commit()
        return True
    return False

def delete_blocklist_item_by_website(db: Session, user_id: int, website: str) -> bool:
    """Delete a blocklist item by website name"""
    item = db.query(BlocklistItem).filter(
        BlocklistItem.user_id == user_id,
        BlocklistItem.website == website
    ).first()
    if item:
        db.delete(item)
        db.commit()
        return True
    return False

def check_website_blocked(db: Session, user_id: int, website: str) -> bool:
    """Check if a website is in user's blocklist"""
    item = db.query(BlocklistItem).filter(
        BlocklistItem.user_id == user_id,
        BlocklistItem.website == website
    ).first()
    return item is not None

# Activity CRUD operations
def create_activity(db: Session, user_id: int, activity_data: ActivityCreate) -> Activity:
    """Create a new activity record"""
    # Convert topic_tags list to JSON string
    topic_tags_json = json.dumps(activity_data.topic_tags) if activity_data.topic_tags else None
    
    db_activity = Activity(
        user_id=user_id,
        problem_name=activity_data.problem_name,
        problem_url=activity_data.problem_url,
        difficulty=activity_data.difficulty,
        topic_tags=topic_tags_json,
        status=activity_data.status
    )
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

def get_user_activities(db: Session, user_id: int, limit: int = 100, offset: int = 0) -> List[Activity]:
    """Get activities for a user with pagination"""
    return db.query(Activity).filter(
        Activity.user_id == user_id
    ).order_by(Activity.completed_at.desc()).limit(limit).offset(offset).all()

def get_activity(db: Session, activity_id: int, user_id: int) -> Optional[Activity]:
    """Get a specific activity by ID and user"""
    return db.query(Activity).filter(
        Activity.id == activity_id,
        Activity.user_id == user_id
    ).first()

def update_activity(db: Session, activity_id: int, user_id: int, activity_data: ActivityUpdate) -> Optional[Activity]:
    """Update an activity record"""
    activity = get_activity(db, activity_id, user_id)
    if not activity:
        return None
    
    # Update fields if provided
    if activity_data.problem_name is not None:
        activity.problem_name = activity_data.problem_name
    if activity_data.problem_url is not None:
        activity.problem_url = activity_data.problem_url
    if activity_data.difficulty is not None:
        activity.difficulty = activity_data.difficulty
    if activity_data.topic_tags is not None:
        activity.topic_tags = json.dumps(activity_data.topic_tags)
    if activity_data.status is not None:
        activity.status = activity_data.status
    
    db.commit()
    db.refresh(activity)
    return activity

def delete_activity(db: Session, activity_id: int, user_id: int) -> bool:
    """Delete an activity record"""
    activity = get_activity(db, activity_id, user_id)
    if activity:
        db.delete(activity)
        db.commit()
        return True
    return False

def get_activity_by_problem_url(db: Session, user_id: int, problem_url: str) -> Optional[Activity]:
    """Get activity by problem URL (for checking duplicates)"""
    return db.query(Activity).filter(
        Activity.user_id == user_id,
        Activity.problem_url == problem_url
    ).first()

def get_activity_stats(db: Session, user_id: int) -> dict:
    """Get activity statistics for a user"""
    total_activities = db.query(Activity).filter(Activity.user_id == user_id).count()
    solved_count = db.query(Activity).filter(
        Activity.user_id == user_id,
        Activity.status == "solved"
    ).count()
    attempted_count = db.query(Activity).filter(
        Activity.user_id == user_id,
        Activity.status == "attempted"
    ).count()
    
    return {
        "total": total_activities,
        "solved": solved_count,
        "attempted": attempted_count
    }
