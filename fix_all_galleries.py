import os
import re
import glob

html_files = glob.glob('/Users/apple/Desktop/Weighbridge_front_end/*.html')

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace(')"">', ')">')
    
    def process_gallery(match):
        gallery_html = match.group(0)
        
        def process_item(item_match):
            div_start = item_match.group(1)
            img_tag = item_match.group(2)
            inner_content = item_match.group(3)
            
            src_match = re.search(r'src="([^"]+)"', img_tag)
            src = src_match.group(1) if src_match else ''
            
            alt_match = re.search(r'alt="([^"]+)"', img_tag)
            alt = alt_match.group(1) if alt_match else 'Image'
            
            if 'onclick="openLightbox' in div_start:
                if 'data-lucide="zoom-in"' not in inner_content:
                    img_tag_mod = img_tag.replace('hover:scale-110', 'group-hover:scale-110').replace('hover:scale-105', 'group-hover:scale-110')
                    overlay = f'''
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div class="bg-primary/20 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100 text-white"><i data-lucide="zoom-in" class="w-5 h-5"></i></div>
                        <h4 class="text-white font-bold text-xl mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">{alt}</h4>
                    </div>'''
                    return f"{div_start}\n                    {img_tag_mod}\n{overlay}\n                </div>"
                return item_match.group(0)
            
            div_start_mod = div_start
            if 'group ' not in div_start_mod and '"group ' not in div_start_mod:
                div_start_mod = div_start_mod.replace('class="', 'class="group relative cursor-pointer ')
            else:
                div_start_mod = div_start_mod.replace('class="', 'class="relative cursor-pointer ')
            div_start_mod = div_start_mod + f' onclick="openLightbox(\'{src}\', \'{alt}\', \'\')"'
            
            img_tag_mod = img_tag.replace('hover:scale-110', 'group-hover:scale-110').replace('hover:scale-105', 'group-hover:scale-110')
            
            overlay = f'''
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div class="bg-primary/20 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100 text-white"><i data-lucide="zoom-in" class="w-5 h-5"></i></div>
                        <h4 class="text-white font-bold text-xl mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">{alt}</h4>
                    </div>'''
            
            return f"{div_start_mod}\n                    {img_tag_mod}\n{overlay}\n                </div>"

        new_gallery = re.sub(
            r'(<div[^>]*rounded-2xl[^>]*overflow-hidden[^>]*>)\s*(<img[^>]+>)(.*?)(</div>)',
            process_item,
            gallery_html,
            flags=re.IGNORECASE | re.DOTALL
        )
        return new_gallery

    new_content = re.sub(r'<section[^>]*id="gallery"[^>]*>.*?</section>', process_gallery, content, flags=re.IGNORECASE | re.DOTALL)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated gallery in {os.path.basename(file_path)}")

print("Done.")
