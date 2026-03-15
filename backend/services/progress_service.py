"""
Progress service — handles activity completion recording and data aggregation for analytics.
"""

import datetime
from typing import List, Dict, Any
from firebase_admin import firestore
from services.firebase_service import _get_db
from models.progress_models import StudentProgressSummary, ClassAnalyticsResponse, StudentClassPerformance

def record_activity_completion(student_id: str, activity_id: str, topic: str, score: int) -> bool:
    """
    Record an activity completion in 'progress' and update 'student_feed'.
    """
    db = _get_db()
    if db is None:
        return False

    try:
        now = datetime.datetime.now().isoformat()
        
        # 1. Create progress record
        progress_data = {
            "student_id": student_id,
            "activity_id": activity_id,
            "topic": topic.lower(),
            "score": score,
            "completed": True,
            "completed_at": now
        }
        
        progress_ref = db.collection("progress").document()
        progress_data["id"] = progress_ref.id
        progress_ref.set(progress_data)

        # 2. Update student feed status
        feed_query = db.collection("student_feed") \
            .where("student_id", "==", student_id) \
            .where("activity_id", "==", activity_id) \
            .limit(1).stream()
        
        feed_docs = list(feed_query)
        if feed_docs:
            feed_docs[0].reference.update({
                "status": "completed",
                "completed_at": now
            })
            
        return True
    except Exception as e:
        print(f"⚠️ Error recording activity completion: {e}")
        return False

def get_student_progress_summary(student_id: str) -> Dict[str, Any]:
    """
    Aggregate progress records by topic for a specific student.
    """
    db = _get_db()
    if db is None:
        return {"student_id": student_id, "progress_summary": {}, "completed_activities": 0}

    try:
        docs = list(db.collection("progress").where("student_id", "==", student_id).stream())
        
        topic_scores = {}
        topic_counts = {}
        total_completed = 0

        for doc in docs:
            data = doc.to_dict()
            topic = data.get("topic")
            score = data.get("score")
            
            # Skip records missing essential summary fields
            if topic is None or score is None:
                continue
                
            topic_scores[topic] = topic_scores.get(topic, 0) + score
            topic_counts[topic] = topic_counts.get(topic, 0) + 1
            total_completed += 1

        summary = {}
        for topic in topic_scores:
            summary[topic] = round(topic_scores[topic] / topic_counts[topic], 1)

        return {
            "student_id": student_id,
            "progress_summary": summary,
            "completed_activities": total_completed
        }
    except Exception as e:
        print(f"⚠️ Error aggregating student progress: {e}")
        return {"student_id": student_id, "progress_summary": {}, "completed_activities": 0}

def get_class_analytics(class_id: str) -> Dict[str, Any]:
    """
    Aggregate performance for all students in a class.
    Assumes a relationship exists in the 'students' collection where each student has a 'class_id'.
    """
    db = _get_db()
    if db is None:
        return {"class_id": class_id, "students": []}

    try:
        # 1. Get all students in the class
        student_docs = db.collection("students").where("class_id", "==", class_id).stream()
        
        analytics_list = []
        for s_doc in student_docs:
            s_data = s_doc.to_dict()
            student_id = s_data.get("id") or s_doc.id
            student_name = s_data.get("name", "Unknown Student")
            
            # 2. Get summary for this student
            # Note: For production with many students, we'd use a more optimized aggregation or pre-calculated fields.
            summary_data = get_student_progress_summary(student_id)
            
            analytics_list.append({
                "student_id": student_id,
                "name": student_name,
                "topic_progress": summary_data["progress_summary"]
            })

        return {
            "class_id": class_id,
            "students": analytics_list
        }
    except Exception as e:
        print(f"⚠️ Error aggregating class analytics: {e}")
        return {"class_id": class_id, "students": []}
