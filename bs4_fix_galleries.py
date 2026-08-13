import os
import glob
import subprocess
import sys

try:
    from bs4 import BeautifulSoup
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "beautifulsoup4", "lxml"])
    from bs4 import BeautifulSoup

html_files = glob.glob('/Users/apple/Desktop/Weighbridge_front_end/*.html')

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix the trailing double quotes on onclick first
    content = content.replace(')"">', ')">')
    
    soup = BeautifulSoup(content, 'html.parser')
    changed = False

    galleries = soup.find_all('section', id='gallery')
    for gallery in galleries:
        # Find all divs that act as image containers (e.g. have rounded-2xl or rounded-xl and overflow-hidden)
        # Or just find all imgs and get their parents.
        for img in gallery.find_all('img'):
            parent = img.parent
            if parent.name == 'div':
                # Check if this div is a container (it usually has rounded-* classes)
                classes = parent.get('class', [])
                
                # Check if it has an onclick or if we need to add one
                onclick = parent.get('onclick', '')
                src = img.get('src', '')
                alt = img.get('alt', 'Image')
                
                if not onclick or 'openLightbox' not in onclick:
                    if 'group' not in classes:
                        classes.append('group')
                    if 'relative' not in classes:
                        classes.append('relative')
                    if 'cursor-pointer' not in classes:
                        classes.append('cursor-pointer')
                    parent['class'] = classes
                    
                    parent['onclick'] = f"openLightbox('{src}', '{alt}', '')"
                    changed = True
                
                # Make sure img has group-hover:scale-110
                img_classes = img.get('class', [])
                if 'hover:scale-110' in img_classes:
                    img_classes.remove('hover:scale-110')
                    img_classes.append('group-hover:scale-110')
                    img['class'] = img_classes
                    changed = True
                elif 'hover:scale-105' in img_classes:
                    img_classes.remove('hover:scale-105')
                    img_classes.append('group-hover:scale-110')
                    img['class'] = img_classes
                    changed = True
                
                # Check if the premium overlay is present. 
                # If there's an older overlay (like bg-slate-900/40), remove it.
                has_premium_overlay = False
                for child in parent.find_all('div', recursive=False):
                    child_classes = child.get('class', [])
                    # Delete the old simple overlay if it exists
                    if 'bg-slate-900/40' in child_classes or 'bg-gradient-to-t' in child_classes:
                        child.decompose()
                        changed = True

                # Add the premium overlay
                premium_overlay_html = f"""
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div class="bg-primary/20 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100 text-white">
                        <i data-lucide="zoom-in" class="w-5 h-5"></i>
                    </div>
                    <h4 class="text-white font-bold text-xl mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">{alt}</h4>
                </div>"""
                
                # Append to parent
                new_overlay = BeautifulSoup(premium_overlay_html, 'html.parser').div
                parent.append(new_overlay)
                changed = True
    
    # We should also check for any gallery items that are NOT in a #gallery section
    # but that might be intended as lightboxes, but the instruction is "in every gallary section".

    if changed:
        # Note: bs4 formatter can sometimes modify whitespace, so we output as string
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        print(f"Updated {file_path}")

print("Done.")
