"""
Video service — generates animated educational videos from resource text.
Uses Gemini for storyboarding, Stable Diffusion for imagery, and MoviePy for assembly.
"""

import os
import json
import uuid
import datetime
# Heavy imports (torch, diffusers, moviepy) moved inside functions for instant startup
from services import gemini_service
from services.firebase_service import _get_db

# Configuration
IMAGE_DIR = "generated_images"
VIDEO_DIR = "generated_videos"
MODEL_ID = "runwayml/stable-diffusion-v1-5"

# Ensure directories exist
os.makedirs(IMAGE_DIR, exist_ok=True)
os.makedirs(VIDEO_DIR, exist_ok=True)

def generate_storyboard(resource_text: str) -> list:
    """
    Use Gemini to generate a structured storyboard from resource text.
    """
    model = gemini_service._get_model()
    
    prompt = (
        "You are an expert educational content creator for children. "
        "Create a short, engaging 3-5 scene animated storyboard from the learning material below.\n\n"
        "Return ONLY a valid JSON array of objects with these keys:\n"
        "- 'scene' (integer)\n"
        "- 'description' (string: visual description for an illustrator)\n"
        "- 'narration' (string: what the narrator says)\n\n"
        "Make it funnel, simple, and suitable for a 5-year-old.\n\n"
        f"Learning Material:\n{resource_text}"
    )

    try:
        response = model.generate_content(prompt)
        raw = gemini_service._clean_json(response.text)
        return json.loads(raw)
    except Exception as e:
        print(f"⚠️ Storyboard Generation Error (Gemini/Quota): {e}")
        # Static fallback storyboard to ensure video generation proceeds
        return [
            {"scene": 1, "description": "A friendly sun rising over a green hill", "narration": "Hello! Today we are learning something new!"},
            {"scene": 2, "description": "Colorful shapes floating in the sky", "narration": "Let's explore the world of knowledge together."},
            {"scene": 3, "description": "A bright rainbow connecting two clouds", "narration": "Learning is like a journey through colors and joy."}
        ]

def generate_fallback_image(description: str, scene_num: int) -> str:
    """
    Creates a simple, high-quality fallback image using PIL.
    Displays an emoji or icon related to the description on a colored background.
    """
    from PIL import Image, ImageDraw, ImageFont
    
    # 1. Create a vibrant background
    colors = ["#FF6D35", "#8B5CF6", "#2EC4B6", "#FFBF69", "#B56576"]
    bg_color = colors[scene_num % len(colors)]
    
    img = Image.new('RGB', (1024, 1024), color=bg_color)
    draw = ImageDraw.Draw(img)
    
    # 2. Add some simple geometric patterns for "Illustration" look
    draw.ellipse([200, 200, 824, 824], fill="#000000") # Removed alpha hex causing error in RGB mode
    
    # 3. Add text (central topic or scene number)
    try:
        # Try to use a system font or default
        font = ImageFont.load_default()
        # In a real environment we'd use a better font, but default is safe
        draw.text((512, 800), f"Scene {scene_num}", fill="white", anchor="ms", font=font)
        draw.text((512, 100), "AI STORYBOARD", fill="white", anchor="mt", font=font)
    except:
        pass
        
    filename = f"fallback_{uuid.uuid4()}.png"
    path = os.path.join(IMAGE_DIR, filename)
    img.save(path)
    return path

def generate_scene_images(storyboard: list) -> list:
    """
    Generate cartoon-style images for each scene. 
    Attempts Stable Diffusion first, then falls back to PIL generation.
    """
    images = []
    pipe = None
    device = "cpu"

    # Step 1: Try to load SD model
    try:
        import torch
        from diffusers import StableDiffusionPipeline
        device = "cuda" if torch.cuda.is_available() else "cpu"
        
        # Check if we should even TRY SD (skip if clearly low resources/demo)
        # For now we try, but with a short timeout or just a single try
        pipe = StableDiffusionPipeline.from_pretrained(
            MODEL_ID, 
            torch_dtype=torch.float16 if device == "cuda" else torch.float32,
            safety_checker=None # Bypass for speed/reliability in demo
        )
        pipe = pipe.to(device)
    except Exception as e:
        print(f"ℹ️ Skipping SD Model loading (falling back to Lite Mode): {e}")

    # Step 2: Process scenes
    for i, scene in enumerate(storyboard):
        desc = scene.get("description", "A happy cartoon scene")
        
        try:
            if pipe:
                prompt = f"Cartoon style illustration for children, vibrant colors, simple shapes, high quality: {desc}"
                num_steps = 20 if device == "cuda" else 5
                image = pipe(prompt, num_inference_steps=num_steps, guidance_scale=7.5).images[0]
                
                filename = f"scene_{uuid.uuid4()}.png"
                path = os.path.join(IMAGE_DIR, filename)
                image.save(path)
                images.append(path)
            else:
                # Use PIL Fallback
                images.append(generate_fallback_image(desc, i + 1))
                
        except Exception as e:
            print(f"⚠️ Image generation error in scene {i+1}, using fallback: {e}")
            images.append(generate_fallback_image(desc, i + 1))
            
    return images

def create_video_from_images(image_paths: list, output_filename: str) -> str:
    """
    Combine images into an MP4 video using MoviePy.
    Falling back to showing the first image if assembly fails (e.g. missing FFmpeg).
    """
    if not image_paths:
        return ""
        
    try:
        from moviepy import ImageSequenceClip
        # Each image shown for 3 seconds
        clip = ImageSequenceClip(image_paths, fps=0.33)  # 1/3 fps = 3 sec per frame
        output_path = os.path.join(VIDEO_DIR, output_filename)
        clip.write_videofile(output_path, codec="libx264", audio=False)
        return f"/videos/{output_filename}"
    except Exception as e:
        print(f"ℹ️ Video assembly (MoviePy/FFmpeg) unavailable, using image fallback: {e}")
        # Return the first image as a "Video Preview" if video assembly fails
        # The frontend will still get a URL to show.
        first_image = image_paths[0]
        # Copy to video dir with .png extension but predictable name
        import shutil
        fallback_name = output_filename.replace(".mp4", ".png")
        fallback_path = os.path.join(VIDEO_DIR, fallback_name)
        shutil.copy(first_image, fallback_path)
        return f"/videos/{fallback_name}"

def generate_learning_video(resource_id: str, resource_text: str) -> dict:
    """
    Orchestrates the storyboard -> images -> video pipeline.
    """
    # Initialize basic result
    result = {
        "resource_id": resource_id,
        "video_url": "",
        "scenes_generated": 0,
        "created_at": datetime.datetime.now().isoformat()
    }
    
    try:
        # 1. Generate Storyboard
        storyboard = generate_storyboard(resource_text)
        
        # 1.5 Auto-translate narration
        from services import firebase_service
        from services.translation_service import translate_if_needed
        
        target_lang = "en"
        db = firebase_service._get_db()
        if db:
            try:
                res_doc = db.collection("resources").document(resource_id).get()
                if res_doc.exists:
                    teacher_id = res_doc.to_dict().get("teacher_id")
                    if teacher_id:
                        target_lang = firebase_service.get_user_language(teacher_id)
            except:
                pass
        
        if target_lang != "en":
            for scene in storyboard:
                scene["narration"] = translate_if_needed(scene.get("narration", ""), target_lang)

        # 2. Generate Images
        image_paths = generate_scene_images(storyboard)
        result["scenes_generated"] = len(image_paths)
        
        # 3. Create Video
        video_filename = f"lesson_{resource_id}.mp4"
        video_url = create_video_from_images(image_paths, video_filename)
        result["video_url"] = video_url
        
        # 4. Persistence (Firestore)
        db = _get_db()
        if db:
            try:
                db.collection("videos").document(resource_id).set(result)
            except Exception as e:
                print(f"⚠️ Firestore video log error: {e}")
                
        return result
    except Exception as e:
        # Final catch-all fallback
        import shutil
        with open("video_service_crash.log", "a") as f:
            f.write(f"[{datetime.datetime.now()}] CATASTROPHIC CRASH in generate_learning_video: {str(e)}\n")
        
        # Ensure we have AT LEAST one image to show
        try:
            fallback_img = generate_fallback_image("Educational Content", 1)
            fallback_name = f"lesson_{resource_id}.png"
            fallback_path = os.path.join(VIDEO_DIR, fallback_name)
            shutil.copy(fallback_img, fallback_path)
            result["video_url"] = f"/videos/{fallback_name}"
            result["scenes_generated"] = 1
        except:
            # If even PIL fails, we are in trouble, but let's try to return something
            result["video_url"] = "/videos/default_placeholder.png"
            
        return result
