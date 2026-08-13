import os
import glob
import re
from PIL import Image

def optimize_images():
    img_dir = "assets/images"
    # Find all PNG and JPG images
    image_files = glob.glob(os.path.join(img_dir, "*.png")) + \
                  glob.glob(os.path.join(img_dir, "*.jpg")) + \
                  glob.glob(os.path.join(img_dir, "*.jpeg"))
                  
    total_saved = 0
    
    for file_path in image_files:
        try:
            # Skip if it's already a webp somehow (though our glob doesn't include it)
            if file_path.endswith('.webp'):
                continue
                
            img = Image.open(file_path)
            # Create new filename
            base = os.path.splitext(file_path)[0]
            new_file_path = base + ".webp"
            
            # Save as webp with 80 quality
            # Convert RGBA to RGB if it's JPEG
            if img.mode in ("RGBA", "P"):
                # webp supports RGBA, so it's fine for pngs
                pass
                
            img.save(new_file_path, "webp", quality=80)
            
            old_size = os.path.getsize(file_path)
            new_size = os.path.getsize(new_file_path)
            
            if new_size < old_size:
                total_saved += (old_size - new_size)
                print(f"Optimized {os.path.basename(file_path)}: {old_size//1024}KB -> {new_size//1024}KB")
                # Remove old file to clean up space
                os.remove(file_path)
            else:
                # If webp is somehow bigger, remove the webp and keep original
                os.remove(new_file_path)
                print(f"Skipped {os.path.basename(file_path)} (WebP was larger)")
        except Exception as e:
            print(f"Error optimizing {file_path}: {e}")

    print(f"\nTotal space saved: {total_saved / (1024*1024):.2f} MB")

def update_html_references():
    html_files = glob.glob("*.html")
    for file_path in html_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Regex to replace assets/images/something.png with .webp
            # Only replacing .png, .jpg, .jpeg within assets/images/
            new_content = re.sub(r'(assets/images/[^"\']+)\.(png|jpg|jpeg)', r'\1.webp', content)

            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated references in {file_path}")
        except Exception as e:
            print(f"Error updating {file_path}: {e}")

if __name__ == "__main__":
    print("Starting Image Optimization...")
    optimize_images()
    print("\nUpdating HTML files to reference WebP images...")
    update_html_references()
    print("Done!")
