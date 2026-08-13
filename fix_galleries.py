import os
import re
import glob

html_files = glob.glob('/Users/apple/Desktop/Weighbridge_front_end/*.html')

pattern = re.compile(
    r'<div class="([^"]*rounded-2xl overflow-hidden shadow-md h-\[300px\][^"]*)">\s*<img src="([^"]*)" alt="([^"]*)" class="([^"]*?)hover:scale-110(.*?)">\s*</div>',
    re.IGNORECASE | re.DOTALL
)

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content, count = pattern.subn(
        r'<div class="\1 group relative cursor-pointer" onclick="openLightbox(\'\2\', \'\3\', \'\')">\n'
        r'                    <img src="\2" alt="\3" class="\4group-hover:scale-110\5">\n'
        r'                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">\n'
        r'                        <div class="bg-primary/20 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100 text-white"><i data-lucide="zoom-in" class="w-5 h-5"></i></div>\n'
        r'                        <h4 class="text-white font-bold text-xl mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">\3</h4>\n'
        r'                    </div>\n'
        r'                </div>',
        content
    )
    
    if count > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {count} gallery items in {os.path.basename(file_path)}")

print("Done.")
