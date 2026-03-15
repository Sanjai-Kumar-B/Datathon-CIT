"""
Recommendation service — identifies learning gaps and recommends next activities.
"""

from typing import Dict, Any, Optional
from services.firebase_service import _get_db
from services.progress_service import get_student_progress_summary
from services import gemini_service

def identify_weak_topic(student_id: str) -> Dict[str, Any]:
    """
    Analyzes student progress to find the weakest topic.
    Returns the topic and a flag indicating if it's for reinforcement.
    """
    summary = get_student_progress_summary(student_id)
    progress_summary = summary.get("progress_summary", {})
    
    if not progress_summary:
        # Fallback if no progress exists
        return {"topic": "alphabet", "is_reinforcement": True, "reason": "Starting your learning journey!"}

    # Find the topic with the minimum score
    weakest_topic = min(progress_summary, key=progress_summary.get)
    lowest_score = progress_summary[weakest_topic]

    # If the lowest score is still high (e.g. > 80), suggest reinforcement
    if lowest_score >= 80:
        return {
            "topic": weakest_topic, 
            "is_reinforcement": True, 
            "reason": f"Great job! You've mastered all topics. Let's practice {weakest_topic} more."
        }
    
    return {
        "topic": weakest_topic,
        "is_reinforcement": False,
        "reason": f"Mastery in {weakest_topic} is currently {lowest_score}%. Let's work on this together!"
    }

def get_recommendation(student_id: str) -> Dict[str, Any]:
    """
    Main entry point for generating a recommendation.
    Checks Firestore cache first; if expired or missing, generates new via Gemini.
    """
    db = _get_db()
    import datetime

    # 1. Check Cache
    if db:
        try:
            cache_ref = db.collection("recommendations").document(student_id).get()
            if cache_ref.exists:
                cached_data = cache_ref.to_dict()
                created_at = datetime.datetime.fromisoformat(cached_data.get("created_at"))
                age = datetime.datetime.now() - created_at
                
                # Cache valid for 24 hours
                if age.total_seconds() < 86400:
                    print(f"ℹ️ Returning cached recommendation for {student_id} ({int(age.total_seconds()/3600)}h old)")
                    return cached_data
        except Exception as e:
            print(f"⚠️ Cache read error: {e}")

    # 2. Identify weak topic
    analysis = identify_weak_topic(student_id)
    topic = analysis["topic"]
    is_reinforcement = analysis["is_reinforcement"]
    reason = analysis["reason"]

    # 3. Get student age (default to 5 if not found)
    child_age = 5
    if db:
        try:
            student_doc = db.collection("students").document(student_id).get()
            if student_doc.exists:
                child_age = student_doc.to_dict().get("age", 5)
        except Exception as e:
            print(f"⚠️ Error fetching student age: {e}")

    # 4. Generate activity suggestion via Gemini
    try:
        activity = gemini_service.generate_recommendation_activity(
            topic=topic,
            child_age=child_age,
            is_reinforcement=is_reinforcement
        )
    except Exception as e:
        print(f"⚠️ Gemini recommendation failure: {e}")
        activity = f"Let's play a fun game about {topic}!"

    # 4.5 Auto-translation based on student's preferred language
    from services import firebase_service
    from services.translation_service import translate_if_needed
    
    target_lang = firebase_service.get_user_language(student_id)
    translated_activity = translate_if_needed(activity, target_lang)
    translated_reason = translate_if_needed(reason, target_lang)

    recommendation = {
        "student_id": student_id,
        "weak_topic": topic,
        "activity": translated_activity,
        "reason": translated_reason,
        "is_reinforcement": is_reinforcement,
        "created_at": datetime.datetime.now().isoformat()
    }

    # 5. Save to Cache
    if db:
        try:
            db.collection("recommendations").document(student_id).set(recommendation)
        except Exception as e:
            print(f"⚠️ Cache write error: {e}")

    return recommendation
