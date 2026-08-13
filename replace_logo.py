import os
import glob
import re

html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Remove the text div next to the logo
    # The div looks like:
    # <div class="flex flex-col">
    # <span class="font-outfit font-black text-2xl tracking-tighter text-dark leading-none">AARAVYA</span>
    # <span class="font-inter font-bold text-[10px] tracking-[0.2em] text-primary uppercase leading-none mt-1">Enterprises</span>
    # </div>
    # Using regex to catch variations in classes
    content = re.sub(
        r'<div class="flex flex-col">\s*<span class="[^"]*">AARAVYA</span>\s*<span class="[^"]*">Enterprises</span>\s*</div>',
        '',
        content
    )

    # 2. Enlarge the logo image classes and remove rotation on hover
    content = content.replace(
        'class="h-10 w-auto group-hover:rotate-12 transition-transform duration-500"',
        'class="h-16 w-auto transition-transform duration-500"'
    )
    content = content.replace(
        'class="h-12 w-auto group-hover:rotate-12 transition-transform duration-500"',
        'class="h-16 w-auto transition-transform duration-500"'
    )
    content = content.replace(
        'class="h-10 w-auto"',
        'class="h-16 w-auto"'
    )

    with open(filepath, 'w') as f:
        f.write(content)

print(f"Updated {len(html_files)} HTML files successfully.")
