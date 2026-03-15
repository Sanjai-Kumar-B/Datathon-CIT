
import sys
import os

print("--- Video Service Diagnostics ---")

try:
    from PIL import Image, ImageDraw, ImageFont
    print("✅ Pillow is installed.")
except ImportError:
    print("❌ Pillow is NOT installed. Run: pip install Pillow")

try:
    import moviepy
    from moviepy.editor import ImageSequenceClip
    print("✅ MoviePy is installed.")
except ImportError:
    print("❌ MoviePy is NOT installed. Run: pip install moviepy")
except Exception as e:
    print(f"❌ MoviePy error: {e}")

try:
    # Check for ffmpeg
    import subprocess
    result = subprocess.run(["ffmpeg", "-version"], capture_output=True, text=True)
    if result.returncode == 0:
        print("✅ FFmpeg is installed and accessible.")
    else:
        print("❌ FFmpeg returned an error.")
except FileNotFoundError:
    print("❌ FFmpeg is NOT found on the system path. MoviePy requires FFmpeg.")

# Test fallback image generation
try:
    import uuid
    IMAGE_DIR = "generated_images"
    os.makedirs(IMAGE_DIR, exist_ok=True)
    
    colors = ["#FF6D35", "#8B5CF6", "#2EC4B6", "#FFBF69", "#B56576"]
    bg_color = colors[0]
    img = Image.new('RGB', (1024, 1024), color=bg_color)
    draw = ImageDraw.Draw(img)
    draw.ellipse([200, 200, 824, 824], fill="#000000") # Simple fill without alpha for testing
    
    filename = f"test_fallback_{uuid.uuid4()}.png"
    path = os.path.join(IMAGE_DIR, filename)
    img.save(path)
    print(f"✅ Fallback image creation worked: {path}")
except Exception as e:
    print(f"❌ Fallback image creation failed: {e}")

print("--- End of Diagnostics ---")
