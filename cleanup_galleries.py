import glob
import re
import os

html_files = glob.glob('/Users/apple/Desktop/Weighbridge_front_end/*.html')

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # The buggy script added ` onclick="openLightbox(..., ..., '')"` right after the closing `>` of the div.
    # It looks like: `> onclick="openLightbox('...', '...', '')"`
    # We want to remove that stray text.
    new_content, count = re.subn(r'>\s*onclick="openLightbox\([^\)]*\)"', '>', content)
    
    if count > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {count} stray onclicks in {os.path.basename(file_path)}")

print("Done cleaning.")
